export const LIMIT=65536;
const keys=(v,allowed)=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!allowed.includes(k)))throw Error('Unexpected fields');};
const num=(n,lo,hi)=>{if(typeof n!=='number'||!Number.isFinite(n)||n<lo||n>hi)throw Error('Invalid metric');return n;};
export function validate(input){
 const text=typeof input==='string'?input:JSON.stringify(input);if(new TextEncoder().encode(text).length>LIMIT)throw Error('Evidence exceeds 64 KiB');
 const v=JSON.parse(text);keys(v,['version','experiment','parent','candidate','cases']);if(v.version!==1||typeof v.experiment!=='string'||!/^[a-zA-Z0-9 _]{1,80}$/.test(v.experiment))throw Error('Invalid experiment');
 for(const m of [v.parent,v.candidate]){keys(m,['quality','safety','costUsd','p95Ms','artifactSha256']);num(m.quality,0,1);num(m.safety,0,1);num(m.costUsd,0,10000);num(m.p95Ms,0,3600000);if(typeof m.artifactSha256!=='string'||!/^[a-f0-9]{64}$/.test(m.artifactSha256))throw Error('Artifact digest required');}
 if(!Array.isArray(v.cases)||v.cases.length<1||v.cases.length>200)throw Error('Cases required');const seen=new Set();
 for(const c of v.cases){keys(c,['id','parentPass','candidatePass']);if(typeof c.id!=='string'||!/^[a-zA-Z0-9_]{1,64}$/.test(c.id)||seen.has(c.id)||typeof c.parentPass!=='boolean'||typeof c.candidatePass!=='boolean')throw Error('Invalid case');seen.add(c.id);}
 return v;
}
export function replay(input){const v=validate(input);const regressions=v.cases.filter(c=>c.parentPass&&!c.candidatePass).map(c=>c.id);const reasons=[];
 if(v.candidate.quality<=v.parent.quality)reasons.push('Quality must improve');
 if(v.candidate.safety<.99||v.candidate.safety<v.parent.safety)reasons.push('Safety gate failed');
 if(regressions.length)reasons.push('Regression detected');
 if(v.candidate.costUsd>v.parent.costUsd)reasons.push('Cost budget exceeded');
 if(v.candidate.p95Ms>v.parent.p95Ms)reasons.push('Latency budget exceeded');
 return {version:1,experiment:v.experiment,recommendation:reasons.length?'reject':'eligible_for_review',reasons,regressions,costDeltaUsd:v.candidate.costUsd-v.parent.costUsd,latencyDeltaMs:v.candidate.p95Ms-v.parent.p95Ms,qualityDelta:v.candidate.quality-v.parent.quality,caseCount:v.cases.length,automaticPromotion:false,evidenceIndependentlyVerified:false};}
export const example={version:1,experiment:'Retrieval experiment',parent:{quality:.8,safety:1,costUsd:.02,p95Ms:200,artifactSha256:'a'.repeat(64)},candidate:{quality:.9,safety:1,costUsd:.015,p95Ms:180,artifactSha256:'b'.repeat(64)},cases:[{id:'citation',parentPass:true,candidatePass:true},{id:'scope',parentPass:true,candidatePass:true}]};
