const rows=25
const cols=25

let grid=[]
let start=null
let goal=null
let mode=""
let explored=0

const gridDiv=document.getElementById("grid")

for(let r=0;r<rows;r++){
for(let c=0;c<cols;c++){

let cell=document.createElement("div")
cell.classList.add("cell")

cell.dataset.row=r
cell.dataset.col=c

cell.onmousedown=cellClick

cell.onmouseover=e=>{
if(e.buttons==1 && mode=="wall"){
cell.classList.add("wall")
}
}

gridDiv.appendChild(cell)
grid.push(cell)

}
}

function setMode(m){
mode=m
}

function cellClick(){

let r=this.dataset.row
let c=this.dataset.col

if(mode=="start"){
clearClass("start")
this.classList.add("start")
start=[parseInt(r),parseInt(c)]
}

if(mode=="goal"){
clearClass("goal")
this.classList.add("goal")
goal=[parseInt(r),parseInt(c)]
}

if(mode=="wall"){
this.classList.add("wall")
}

}

function clearClass(cls){
grid.forEach(c=>c.classList.remove(cls))
}

function getCell(r,c){
return grid.find(x=>x.dataset.row==r && x.dataset.col==c)
}

function resetGrid(){
location.reload()
}

function sleep(){
let speed=document.getElementById("speed").value
return new Promise(r=>setTimeout(r,101-speed))
}

function updateNodes(){
document.getElementById("nodes").innerText=explored
}

async function runAlgorithm(){

explored=0
let algo=document.getElementById("algorithm").value

if(algo=="bfs") runBFS()
if(algo=="dfs") runDFS()
if(algo=="astar") runAStar()

}

async function runBFS(){

let queue=[[start]]
let visited=new Set()

let moves=[[1,0],[-1,0],[0,1],[0,-1]]

while(queue.length){

let path=queue.shift()
let [r,c]=path[path.length-1]

if(r==goal[0] && c==goal[1]){
drawPath(path)
return
}

for(let m of moves){

let nr=r+m[0]
let nc=c+m[1]

if(valid(nr,nc,visited)){

visited.add(nr+","+nc)

let next=getCell(nr,nc)

if(!next.classList.contains("goal"))
next.classList.add("visited")

explored++
updateNodes()

await sleep()

queue.push([...path,[nr,nc]])

}

}

}

}

async function runDFS(){

let stack=[[start]]
let visited=new Set()

let moves=[[1,0],[-1,0],[0,1],[0,-1]]

while(stack.length){

let path=stack.pop()
let [r,c]=path[path.length-1]

if(r==goal[0] && c==goal[1]){
drawPath(path)
return
}

for(let m of moves){

let nr=r+m[0]
let nc=c+m[1]

if(valid(nr,nc,visited)){

visited.add(nr+","+nc)

let next=getCell(nr,nc)

if(!next.classList.contains("goal"))
next.classList.add("visited")

explored++
updateNodes()

await sleep()

stack.push([...path,[nr,nc]])

}

}

}

}

async function runAStar(){

let open=[[start,0]]
let visited=new Set()

while(open.length){

open.sort((a,b)=>a[1]-b[1])

let [path,cost]=open.shift()
let [r,c]=path[path.length-1]

if(r==goal[0] && c==goal[1]){
drawPath(path)
return
}

let moves=[[1,0],[-1,0],[0,1],[0,-1]]

for(let m of moves){

let nr=r+m[0]
let nc=c+m[1]

if(valid(nr,nc,visited)){

visited.add(nr+","+nc)

let g=path.length
let h=Math.abs(goal[0]-nr)+Math.abs(goal[1]-nc)

let f=g+h

let next=getCell(nr,nc)

if(!next.classList.contains("goal"))
next.classList.add("visited")

explored++
updateNodes()

await sleep()

open.push([[...path,[nr,nc]],f])

}

}

}

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
await sleep()
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
