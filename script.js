const rows = 20
const cols = 20

let grid=[]
let start=null
let goal=null
let mode=""
let speed=20

const gridDiv=document.getElementById("grid")

for(let r=0;r<rows;r++){
for(let c=0;c<cols;c++){

let cell=document.createElement("div")
cell.classList.add("cell")

cell.dataset.row=r
cell.dataset.col=c

cell.onclick=cellClick

gridDiv.appendChild(cell)
grid.push(cell)

}
}

function setMode(m){
mode=m
}

function setSpeed(val){
speed=parseInt(val)
}

function cellClick(){

let r=parseInt(this.dataset.row)
let c=parseInt(this.dataset.col)

if(mode=="start"){
clearClass("start")
this.classList.add("start")
start=[r,c]
}

if(mode=="goal"){
clearClass("goal")
this.classList.add("goal")
goal=[r,c]
}

if(mode=="wall"){
this.classList.add("wall")
}

if(mode=="erase"){
this.classList.remove("wall")
}

}

function clearClass(cls){
grid.forEach(c=>c.classList.remove(cls))
}

function getCell(r,c){
return grid.find(x=>x.dataset.row==r && x.dataset.col==c)
}

function clearGrid(){

grid.forEach(cell=>{
cell.classList.remove("wall","visited","path","start","goal")
})

start=null
goal=null

}

function sleep(ms){
return new Promise(resolve=>setTimeout(resolve,ms))
}

function valid(r,c,visited){

if(r<0||c<0||r>=rows||c>=cols) return false

let cell=getCell(r,c)

if(cell.classList.contains("wall")) return false

if(visited.has(r+","+c)) return false

return true
}

async function drawPath(path){

for(let p of path){

let cell=getCell(p[0],p[1])

if(!cell.classList.contains("start") && !cell.classList.contains("goal")){
cell.classList.add("path")
await sleep(speed)
}

}

}

function clearSearch(){
grid.forEach(c=>{
c.classList.remove("visited","path")
})
}

async function runAlgorithm(){

let algo=document.getElementById("algorithm").value

if(!start || !goal){
alert("Set Start and Goal first")
return
}

clearSearch()

if(algo=="bfs") await runBFS()
if(algo=="dfs") await runDFS()
if(algo=="astar") await runAStar()

}

async function runBFS(){

let queue=[[start]]
let visited=new Set()

visited.add(start.join(","))

let moves=[[1,0],[-1,0],[0,1],[0,-1]]

while(queue.length){

let path=queue.shift()
let [r,c]=path[path.length-1]

if(r==goal[0] && c==goal[1]){
await drawPath(path)
return
}

for(let m of moves){

let nr=r+m[0]
let nc=c+m[1]

if(valid(nr,nc,visited)){

visited.add(nr+","+nc)

let next=getCell(nr,nc)
next.classList.add("visited")

await sleep(speed)

queue.push([...path,[nr,nc]])

}

}

}

}

async function runDFS(){

let stack=[[start]]
let visited=new Set()

visited.add(start.join(","))

let moves=[[1,0],[-1,0],[0,1],[0,-1]]

while(stack.length){

let path=stack.pop()
let [r,c]=path[path.length-1]

if(r==goal[0] && c==goal[1]){
await drawPath(path)
return
}

for(let m of moves){

let nr=r+m[0]
let nc=c+m[1]

if(valid(nr,nc,visited)){

visited.add(nr+","+nc)

let next=getCell(nr,nc)
next.classList.add("visited")

await sleep(speed)

stack.push([...path,[nr,nc]])

}

}

}

}

function heuristic(a,b){

let dx=Math.abs(a[0]-b[0])
let dy=Math.abs(a[1]-b[1])

return Math.sqrt(dx*dx+dy*dy)

}

async function runAStar(){

let open=[{pos:start,path:[start],g:0}]
let visited=new Set()

let moves=[
[1,0],[-1,0],[0,1],[0,-1],
[1,1],[-1,-1],[1,-1],[-1,1]
]

while(open.length){

open.sort((a,b)=>
(a.g+heuristic(a.pos,goal))-(b.g+heuristic(b.pos,goal))
)

let current=open.shift()

let [r,c]=current.pos
let path=current.path

if(r==goal[0] && c==goal[1]){
await drawPath(path)
return
}

visited.add(r+","+c)

for(let m of moves){

let nr=r+m[0]
let nc=c+m[1]

if(valid(nr,nc,visited)){

visited.add(nr+","+nc)

let next=getCell(nr,nc)
next.classList.add("visited")

await sleep(speed)

open.push({
pos:[nr,nc],
path:[...path,[nr,nc]],
g:current.g+1
})

}

}

}

}

function generateMaze(){

grid.forEach(c=>{
if(!c.classList.contains("start") && !c.classList.contains("goal")){
if(Math.random()<0.3) c.classList.add("wall")
}
})

}