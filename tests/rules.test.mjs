// Security rules tests. Run with: npm run test:rules
// (starts the Realtime Database emulator, runs this file, then stops it)
import { test, before, beforeEach, after } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';

const NOW = { '.sv': 'timestamp' };
const SONGS = {
  1: { id: 1, title: 'Dreams', artist: 'Fleetwood Mac', era: '70s', genre: 'Rock', active: true },
  2: { id: 2, title: 'Creep', artist: 'Radiohead', era: '90s', genre: 'Rock', active: false },
};

let env;
const google = uid => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'google.com' } }).database();
const anon = uid => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).database();
const nobody = () => env.unauthenticatedContext().database();
const seed = data => env.withSecurityRulesDisabled(ctx => ctx.database().ref().update(data));
const peek = path => { let v; return env.withSecurityRulesDisabled(async ctx => { v = (await ctx.database().ref(path).once('value')).val(); }).then(() => v); };

// The one atomic write the stage view makes when an act is created.
function createAct(uid, artistId, slug, actName = 'The Doorknobs', extra = {}) {
  return {
    [`artists/${artistId}/members/${uid}`]: 'owner',
    [`artists/${artistId}/settings`]: { actName, slug, venue: '', tipLink: '', requestMode: 'list', createdAt: NOW },
    [`artists/${artistId}/songs`]: SONGS,
    [`slugs/${slug}`]: artistId,
    [`users/${uid}/artists/${artistId}`]: true,
    ...extra,
  };
}

// A fan request, with its name and the speed-bump timestamp, in one write.
function fanRequest(uid, key, { song = SONGS[1], name = 'Sarah', fan = uid, ts = NOW, fanLast = true } = {}) {
  const u = { [`requests/queue/${key}`]: { songId: song.id, title: song.title, artist: song.artist, ts, fan } };
  if (name) u[`requestNames/${key}`] = name;
  if (fanLast) u[`fanLast/${uid}`] = NOW;
  return u;
}
const act = (db, id = 'actA') => db.ref(`artists/${id}`);

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-live-requests',
    database: { rules: readFileSync(new URL('../database.rules.json', import.meta.url), 'utf8'), host: '127.0.0.1', port: 9000 },
  });
});
beforeEach(async () => {
  await env.clearDatabase();
  await seed(createAct('kyle', 'actA', 'the-doorknobs'));
  await seed({ ...createAct('rob', 'actB', 'rob-solo', 'Rob Solo'), 'artists/actB/requestHistory/sessions/s1': { date: '2026-11-01', venue: 'X' } });
});
after(() => env.cleanup());

// ── Creating an act ─────────────────────────────────────────────
test('a Google user can create an act in one write', async () => {
  await assertSucceeds(google('newbie').ref().update(createAct('newbie', 'actN', 'new-act', 'New Act')));
  const s = await peek('artists/actN/settings');
  if (s.slug !== 'new-act' || typeof s.createdAt !== 'number') throw new Error('settings not stored');
});
test('an anonymous fan cannot create an act', async () => {
  await assertFails(anon('fan1').ref().update(createAct('fan1', 'actN', 'new-act')));
});
test('nobody can claim a link that is already taken', async () => {
  await assertFails(google('newbie').ref().update(createAct('newbie', 'actN', 'the-doorknobs')));
  await assertFails(google('newbie').ref('slugs/the-doorknobs').set('actN'));
});
test('bad or reserved links are rejected', async () => {
  for (const slug of ['qr', 'request', 'setup', 'stage', 'ab', 'Big-Band', 'big band', '-band', 'band-', 'a--b', 'x'.repeat(31)]) {
    await assertFails(google('newbie').ref().update(createAct('newbie', 'act' + slug.length, slug)));
  }
  await assertSucceeds(google('newbie').ref().update(createAct('newbie', 'actN', 'abc')));
});
test('an act cannot point at a link it did not claim', async () => {
  const u = createAct('newbie', 'actN', 'new-act');
  delete u['slugs/new-act'];
  await assertFails(google('newbie').ref().update(u));
});
test('you cannot claim a link for someone else\'s act', async () => {
  await assertFails(google('newbie').ref('slugs/doorknobs-fans').set('actA'));
});
test('a half-made act is rejected', async () => {
  await assertFails(google('newbie').ref('artists/actN/members/newbie').set('owner'));
});
test('you cannot add yourself to an existing act', async () => {
  await assertFails(google('newbie').ref('artists/actA/members/newbie').set('owner'));
});

// ── The act editing its own data ────────────────────────────────
test('the owner can edit settings; others cannot', async () => {
  await assertSucceeds(act(google('kyle')).child('settings').update({ venue: 'Waterline Brewing', tipLink: 'https://venmo.com/u/kyle' }));
  await assertFails(act(google('rob')).child('settings').update({ venue: 'Hacked' }));
  await assertFails(act(anon('fan1')).child('settings').update({ venue: 'Hacked' }));
});
test('settings reject unsafe tip links, empty names and unknown fields', async () => {
  await assertFails(act(google('kyle')).child('settings').update({ tipLink: 'javascript:alert(1)' }));
  await assertFails(act(google('kyle')).child('settings').update({ actName: '' }));
  await assertFails(act(google('kyle')).child('settings').update({ requestMode: 'open' }));
  await assertFails(act(google('kyle')).child('settings').update({ isAdmin: true }));
});
test('the owner can add songs; ids must match their key', async () => {
  await assertSucceeds(act(google('kyle')).child('songs/3').set({ id: 3, title: 'Yellow', artist: 'Coldplay', era: '2000s', genre: 'Pop', active: true }));
  await assertFails(act(google('kyle')).child('songs/4').set({ id: 5, title: 'Iris', artist: 'Goo Goo Dolls', active: true }));
  await assertFails(act(google('rob')).child('songs/4').set({ id: 4, title: 'Iris', artist: 'Goo Goo Dolls', active: true }));
});
test('changing the link keeps the old one pointing at the act', async () => {
  const db = google('kyle');
  await assertSucceeds(db.ref().update({ 'slugs/doorknobs': 'actA', 'artists/actA/settings/slug': 'doorknobs' }));
  if (await peek('slugs/the-doorknobs') !== 'actA') throw new Error('old link was lost');
  await assertFails(db.ref('slugs/doorknobs').remove());           // the current link can't be released
  await assertFails(google('rob').ref('slugs/the-doorknobs').remove()); // nor someone else's
  await assertSucceeds(db.ref('slugs/the-doorknobs').remove());     // an old one can
});
test('the owner can mark the same song played twice in a night', async () => {
  const db = google('kyle');
  const p = { songId: 1, title: 'Dreams', artist: 'Fleetwood Mac', ts: NOW };
  await assertSucceeds(act(db).child('requests/played').push(p));
  await assertSucceeds(act(db).child('requests/played').push(p));
  if (Object.keys(await peek('artists/actA/requests/played')).length !== 2) throw new Error('second play overwrote the first');
});
test('the owner can run the night: dismiss, read names, end the night', async () => {
  await assertSucceeds(act(anon('fan1')).update(fanRequest('fan1', 'r1')));
  const db = google('kyle');
  await assertSucceeds(act(db).child('requests/queue/r1/dismissed').set(true));
  await assertSucceeds(act(db).child('requestNames').once('value'));
  await assertSucceeds(act(db).update({
    'requestHistory/sessions/s1': { date: '2026-11-11', venue: '', requestCount: 1, playedCount: 0 },
    'requestHistory/requests/h1': { songId: 1, title: 'Dreams', artist: 'Fleetwood Mac', name: 'Sarah', ts: 1, sessionId: 's1', venue: '', played: false },
    'requests/queue': null, 'requests/played': null, requestNames: null, fanLast: null,
  }));
});
test('one act cannot touch another act\'s data', async () => {
  const db = google('kyle');
  await assertFails(act(db, 'actB').child('requestHistory').once('value'));
  await assertFails(act(db, 'actB').child('requests/queue').remove());
  await assertFails(act(db, 'actB').child('songs/1/active').set(false));
  await assertFails(act(db, 'actB').child('members').once('value'));
});
test('a user can read only their own act list', async () => {
  await assertSucceeds(google('kyle').ref('users/kyle').once('value'));
  await assertFails(google('kyle').ref('users/rob').once('value'));
  await assertFails(google('kyle').ref('users/rob/artists/actA').set(true));
});

// ── Fans ────────────────────────────────────────────────────────
test('anyone can read the public parts of an act, but cannot list acts', async () => {
  const db = nobody();
  for (const p of ['slugs/the-doorknobs', 'artists/actA/settings', 'artists/actA/songs', 'artists/actA/requests/queue', 'artists/actA/requests/played']) {
    await assertSucceeds(db.ref(p).once('value'));
  }
  for (const p of ['slugs', 'artists', 'artists/actA', 'artists/actA/members', 'artists/actA/requestNames', 'artists/actA/requestHistory', 'artists/actA/fanLast', 'users']) {
    await assertFails(db.ref(p).once('value'));
  }
});
test('fan names are hidden from other fans', async () => {
  await assertSucceeds(act(anon('fan1')).update(fanRequest('fan1', 'r1')));
  await assertFails(act(anon('fan2')).child('requestNames').once('value'));
  await assertFails(act(anon('fan2')).child('requestNames/r1').once('value'));
  const q = await peek('artists/actA/requests/queue/r1');
  if ('name' in q) throw new Error('name leaked into the public queue');
});
test('a fan can send a request, with or without a name', async () => {
  await assertSucceeds(act(anon('fan1')).update(fanRequest('fan1', 'r1')));
  await assertSucceeds(act(anon('fan2')).update(fanRequest('fan2', 'r2', { name: null })));
});
test('a fan who is not signed in cannot send a request', async () => {
  await assertFails(act(nobody()).update(fanRequest('x', 'r1')));
});
test('the request must match a real, active song', async () => {
  await assertFails(act(anon('fan1')).update(fanRequest('fan1', 'r1', { song: { id: 1, title: 'Something rude', artist: 'Fleetwood Mac' } })));
  await assertFails(act(anon('fan1')).update(fanRequest('fan1', 'r1', { song: SONGS[2] })));
  await assertFails(act(anon('fan1')).update(fanRequest('fan1', 'r1', { song: { id: 99, title: 'Nope', artist: 'Nobody' } })));
});
test('a request must carry the fan\'s own id, server time and speed-bump stamp', async () => {
  await assertFails(act(anon('fan1')).update(fanRequest('fan1', 'r1', { fan: 'someone-else' })));
  await assertFails(act(anon('fan1')).update(fanRequest('fan1', 'r1', { ts: 12345 })));
  await assertFails(act(anon('fan1')).update(fanRequest('fan1', 'r1', { fanLast: false })));
});
test('speed bump: one request per fan every 30 seconds', async () => {
  const db = anon('fan1');
  await assertSucceeds(act(db).update(fanRequest('fan1', 'r1')));
  await assertFails(act(db).update(fanRequest('fan1', 'r2')));
  await assertFails(act(db).child('fanLast/fan1').remove());               // can't reset it
  await seed({ 'artists/actA/fanLast/fan1': Date.now() - 20000 });
  await assertFails(act(db).update(fanRequest('fan1', 'r2')));
  await seed({ 'artists/actA/fanLast/fan1': Date.now() - 31000 });
  await assertSucceeds(act(db).update(fanRequest('fan1', 'r2')));
  await assertSucceeds(act(anon('fan2')).update(fanRequest('fan2', 'r3'))); // other fans aren't affected
});
test('a fan cannot change, dismiss or delete requests, or mark songs played', async () => {
  await assertSucceeds(act(anon('fan1')).update(fanRequest('fan1', 'r1')));
  const db = anon('fan1');
  await assertFails(act(db).child('requests/queue/r1/dismissed').set(true));
  await assertFails(act(db).child('requests/queue/r1').remove());
  await assertFails(act(db).child('requests/queue').remove());
  await assertFails(act(db).child('requestNames/r1').set('Changed'));
  await assertFails(act(db).child('requests/played').push({ songId: 1, title: 'Dreams', artist: 'Fleetwood Mac', ts: NOW }));
});
test('a fan cannot attach a name to someone else\'s request', async () => {
  await assertSucceeds(act(anon('fan1')).update(fanRequest('fan1', 'r1', { name: null })));
  await assertFails(act(anon('fan2')).child('requestNames/r1').set('Troll'));
});
test('a fan cannot edit songs or settings, or read history', async () => {
  const db = anon('fan1');
  await assertFails(act(db).child('songs/1/active').set(false));
  await assertFails(act(db).child('songs/3').set({ id: 3, title: 'X', artist: 'Y', active: true }));
  await assertFails(act(db).child('settings/tipLink').set('https://evil.example'));
  await assertFails(act(db, 'actB').child('requestHistory').once('value'));
});
test('a fan cannot create junk under an act that does not exist', async () => {
  await assertFails(anon('fan1').ref('artists/nope/fanLast/fan1').set(NOW));
});
test('names longer than 40 characters are rejected', async () => {
  await assertFails(act(anon('fan1')).update(fanRequest('fan1', 'r1', { name: 'x'.repeat(41) })));
});
