import {replay,example} from './evidence.mjs';import {performance} from 'node:perf_hooks';
export function benchmark(){const times=[];for(let i=0;i<1000;i++){const t=performance.now();replay(example);times.push(performance.now()-t);}times.sort((a,b)=>a-b);return {fixture:'two-cases',iterations:1000,p50Ms:times[500],p95Ms:times[950],automaticPromotion:false};}
export const status=()=>({project:'reflective-engineer',version:2,commands:['replay','benchmark','status'],automaticPromotion:false});
