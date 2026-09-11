import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {replay,example} from '../console/evidence.mjs';
const edit=()=>structuredClone(example);
test('eligible fixture remains manual and unverified',()=>{const r=replay(example);assert.equal(r.recommendation,'eligible_for_review');assert.equal(r.automaticPromotion,false);assert.equal(r.evidenceIndependentlyVerified,false);assert.deepEqual(r,replay(JSON.stringify(example)));});
for(const [field,value] of [['quality',.7],['safety',.98],['costUsd',1],['p95Ms',300]])test(`reject ${field}`,()=>{const v=edit();v.candidate[field]=value;assert.equal(replay(v).recommendation,'reject');});
test('regression rejects despite improved quality',()=>{const v=edit();v.cases[0].candidatePass=false;assert.deepEqual(replay(v).regressions,['citation']);});
test('malformed data denied',()=>{for(const v of [null,{},'x'.repeat(65537),{...edit(),admin:true}])assert.throws(()=>replay(v));const v=edit();v.candidate.quality=Infinity;assert.throws(()=>replay(v));v.candidate.quality=.9;v.cases.push(v.cases[0]);assert.throws(()=>replay(v));});
test('artifact digests required',()=>{const v=edit();v.candidate.artifactSha256='fake';assert.throws(()=>replay(v));});
test('CLI parity',()=>{const r=spawnSync(process.execPath,['console/cli.mjs','replay'],{input:JSON.stringify(example),encoding:'utf8'});assert.equal(r.status,0);assert.deepEqual(JSON.parse(r.stdout),replay(example));});
