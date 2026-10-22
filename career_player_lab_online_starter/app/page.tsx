 "use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
const KEY="career-player-lab-online-v1", ROW="career-player-lab-main";
export default function Home(){
 const [ready,setReady]=useState(false),[status,setStatus]=useState("Menghubungkan database..."),[cloud,setCloud]=useState(false);
 const client=useRef<SupabaseClient|null>(null),last=useRef(""),busy=useRef(false);
 const local=useCallback(()=>{try{return localStorage.getItem(KEY)||""}catch{return ""}},[]);
 useEffect(()=>{const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key){setStatus("Database belum dikonfigurasi");setReady(true);return}
 const db=createClient(url,key);client.current=db;let live=true;
 (async()=>{try{const {data,error}=await db.from("career_player_lab_state").select("id,state,updated_at").eq("id",ROW).maybeSingle();if(error)throw error;
 if(data?.state){const v=JSON.stringify(data.state);localStorage.setItem(KEY,v);last.current=v}
 else {const v=local();if(v){const {error:e}=await db.from("career_player_lab_state").insert({id:ROW,state:JSON.parse(v)});if(e&&e.code!=="23505")throw e;last.current=v}}
 if(live){setCloud(true);setStatus("Database online tersambung");setReady(true)}
 }catch(e){console.error(e);if(live){setStatus("Gagal terhubung. Periksa konfigurasi Supabase.");setReady(true)}}})();
 return()=>{live=false}},[local]);
 useEffect(()=>{if(!ready||!cloud||!client.current)return;const db=client.current;
 const timer=setInterval(async()=>{if(busy.current)return;busy.current=true;try{const v=local();
 if(v&&v!==last.current){const {error}=await db.from("career_player_lab_state").upsert({id:ROW,state:JSON.parse(v),updated_at:new Date().toISOString()},{onConflict:"id"});if(error)throw error;last.current=v;setStatus("Tersimpan online · "+new Date().toLocaleTimeString("id-ID"))}
 else {const {data,error}=await db.from("career_player_lab_state").select("state,updated_at").eq("id",ROW).maybeSingle();if(error)throw error;if(data?.state){const remote=JSON.stringify(data.state);if(last.current&&remote!==last.current){localStorage.setItem(KEY,remote);last.current=remote;location.reload()}else if(!last.current)last.current=remote}}
 }catch(e){console.error(e);setStatus("Sinkronisasi gagal")}finally{busy.current=false}},2500);
 return()=>clearInterval(timer)},[ready,cloud,local]);
 return <main style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}><div style={{padding:"9px 16px",background:"#111720",borderBottom:"1px solid #293343",display:"flex",justifyContent:"space-between",gap:10,fontSize:12}}><strong style={{color:"#b8f45c"}}>CAREER PLAYER LAB</strong><span style={{color:"#93a1b5",textAlign:"right"}}>{status}</span></div>{!ready?<p style={{padding:24}}>Menyiapkan Career Save...</p>:<iframe title="Career Player Lab" src="/career.html" style={{border:0,width:"100%",height:"calc(100vh - 39px)",minHeight:700,flex:1}}/>}</main>
}
