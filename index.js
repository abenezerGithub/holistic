const canvas = document.querySelector(".canvas")
const scoreEl = document.querySelector('#scoreEl')
canvas.height = 400
//canvas.width = 400
let score = 0
let forGhost = false;
const c = canvas.getContext("2d"),
      cw = canvas.width,
      ch = canvas.height;
      let cnt =0;
      let tog = true;
const up = document.querySelector(".up")
const down = document.querySelector(".down")
const left = document.querySelector(".left")
const right = document.querySelector(".right")
 class Boundary {
     static w = cw/16
     static h = ch/20
     constructor({x,y}) {
         this.pos = {
             x,
             y
         }
         this.w = Boundary.w
         this.h = Boundary.h
         this.clr =  "rgba(0,0,250,.25)"
     }
     draw(c) {
       c.fillStyle = this.clr
      c.fillRect(this.pos.x,this.pos.y,this.w,this.h)  
      c.lineWidth = .6
      
  //    c.strokeStyle = "rgba(0,0,0,.2)"
  //    c.strokeRect(this.pos.x,this.pos.y,this.w,this.h)  
     }
     update(c) {
         this.draw(c)
     }
 }
 
class PowerUp {
  constructor({ pos }) {
    this.pos = pos
    this.r = 5.6
    this.color ="crimson"
  }

  draw() {
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    this.color = cnt %2?"royalblue":"red"
  }
}
 class Pellet {
  constructor({ pos }) {
    this.pos = pos
    this.r = 2.1
  }

  draw() {
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2)
    c.fillStyle = cnt%2?'lime':"orange"
    c.fill()
    c.closePath()
  }
}

class Ghost {
  static speed =  1
  static r = 7.4
  constructor({ pos, velocity, color = 'red' },scare = false) {
    this.pos = pos
    this.velocity = velocity
    this.r= Ghost.r
    this.color = color
    this.prevCollisions = []
    this.speed = Ghost.speed
    this.scared = scare
    this.fear ="blue"
  }

  draw(c) {
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2)
    c.fillStyle = this.scared? this.fear :this.color
    c.fill()
    c.closePath()
  }

  update(c) {
    this.draw(c)
    this.pos.x += this.velocity.x
    this.pos.y += this.velocity.y
  }
}

 class Player{
     static speed = Math.PI;
     constructor() {
         this.r = 6.4
         this.velocity = {
             x:0,
             y:0
         }
         this.pos = {
            x : Boundary.w + this.r + Player.speed,
            y :Boundary.h + this.r + Player.speed
         }
         this.clr = "yellow"
    this.radians = .60
    this.openRate = 0.25
    this.rotation = 0
     }
     draw(c) {
       c.save()
    c.translate(this.pos.x, this.pos.y)
    c.rotate(this.rotation)
    c.translate(-this.pos.x, -this.pos.y)
    c.beginPath()
    c.arc(
      this.pos.x,
      this.pos.y,
      this.r,
      this.radians,
      Math.PI * 2 - this.radians
    )
    c.lineTo(this.pos.x, this.pos.y)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
    c.restore()
     }
     
     
     update(c) {
         this.draw(c)
  this.pos.y += this.velocity.y;
         this.pos.x += this.velocity.x;
 if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate

    this.radians += this.openRate
     }
 }
let boundaries = [];
let powerUps = []
let pellets = []
let ghosts = [new Ghost({
    pos:{
     x:Boundary.w+Ghost.r+140,
     y:ch- Boundary.h - Ghost.r -130
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"lightblue"
}),
new Ghost({
    pos:{
     x:Boundary.w+Ghost.r+180,
     y:ch- Boundary.h - Ghost.r -130
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"orange"
}),
new Ghost({
    pos:{
     x:Boundary.w+Ghost.r+180,
     y:ch- Boundary.h - Ghost.r -130
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"lightblue"
}),
new Ghost({
    pos:{
     x:cw - Boundary.w - Ghost.r - 2,
     y:Boundary.h + Ghost.r + 4
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"red"
}),
new Ghost({
    pos:{
     x:cw-Boundary.w- Ghost.r -2,
     y:ch- Boundary.h - Ghost.r - 2
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"green"
}),
new Ghost({
    pos:{
     x:Boundary.w+Ghost.r+180,
     y:ch- Boundary.h - Ghost.r -130
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"white"
}),
new Ghost({
    pos:{
     x:Boundary.w+Ghost.r+180,
     y:ch- Boundary.h - Ghost.r -130
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"limegreen"
}),
new Ghost({
    pos:{
    x:Boundary.w+ Ghost.r+3,
     y:ch- Boundary.h - Ghost.r - 2
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"yellow"
}),
new Ghost({
    pos:{
     x:Boundary.w + Ghost.r +3 ,
     y:ch/3 - 3
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"cyan"
}),
new Ghost({
    pos:{
     x:Boundary.w+ Ghost.r+3,
     y:ch- Boundary.h - Ghost.r - 2
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },color:"purple"
})
]
let player = new Player()
let lastkey;
let pressed = {
    w:false,
    a:false,
    s:false,
    d:false
}
let grid = [
    [ "|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|"],
    [ "|"," "," "," "," "," "," "," "," "," "," "," "," "," ","p","|"],
    [ "|"," "," "," "," "," ","|"," ","|"," ","|"," ","|"," "," ","|"],
    [ "|"," "," "," "," ","|"," "," "," "," ","|"," "," "," "," ","|"],
    [ "|"," "," ","|"," "," "," "," "," ","|"," "," "," ","|"," ","|"],
    [ "|"," "," "," "," "," ","|"," "," "," "," "," "," "," "," ","|"],
    [ "|"," "," "," ","|"," "," "," "," ","|"," ","|"," "," ","|","|"],
    [ "|","|"," "," "," ","|"," "," ","|"," "," "," ","|"," "," ","|"],
    [ "|"," "," "," "," "," ","|"," "," ","|"," "," "," "," "," ","|"],
    [ "|"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","|"],
    [ "|"," "," ","|"," "," "," "," ","|"," "," ","|"," "," "," ","|"],
    [ "|","|"," "," ","|"," "," "," "," "," "," "," "," "," "," ","|"],
    [ "|",""," "," "," "," "," ","|"," "," "," "," "," "," ","|","|"],
    [ "|",""," ","|",""," "," "," "," "," "," "," "," ","|","|","|"],
    [ "|",""," "," "," "," "," ","|"," ","|","p"," "," "," "," ","|"],
    [ "|","|"," "," ","|"," "," "," "," "," "," "," "," "," ","|","|"],
    [ "|"," ","|"," "," ","|"," "," "," "," "," "," "," "," ","|","|"],
    [ "|"," "," "," ","|"," "," ","|"," "," "," "," "," "," "," ","|"],
    [ "|","p"," "," "," "," "," "," "," "," "," "," ","|"," "," ","|"],
    [ "|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|"],
    ]
grid.forEach((arr,i) => {
    arr.forEach((val,j) => {
     switch(val) {
       case "|" :
         boundaries.push(new Boundary({
             x:Boundary.w*j,
             y:Boundary.h*i
             
         }))
          break;
             case ' ':
        pellets.push(
          new Pellet({
            pos: {
              x: j * Boundary.w + Boundary.w/ 2,
              y: i * Boundary.h + Boundary.h / 2
            }
          })
        )
        break
 case 'p':
        powerUps.push(
          new PowerUp({
            pos: {
              x: j * Boundary.w+ Boundary.w/ 2,
              y: i * Boundary.h+ Boundary.h / 2
            }
          })
        )
        break
                
    }
  })
})
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate)
    cnt++;
    cnt++
   c.save()
    c.fillStyle = "rgba(0,0,0,.35)"
    c.fillRect(0,0,cw,ch)
    
  boundaries.forEach((boundary) => {
       boundary.update(c)
    
    if(rcCollision(player,boundary)){
      player.velocity.x = 0
       player.velocity.y = 0
    }
    })
for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i]
    pellet.draw()

    if (
      Math.hypot(
        pellet.pos.x - player.pos.x,
        pellet.pos.y - player.pos.y
      ) <
      pellet.r + player.r
    ) {
      pellets.splice(i, 1)
      score += 10
      scoreEl.innerHTML = score
    }
  }
for(let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i]
    powerUp.draw()

    // player collides with powerup
    if (
      Math.hypot(
        powerUp.pos.x - player.pos.x,
        powerUp.pos.y - player.pos.y
      ) < powerUp.r + player.r) {
      powerUps.splice(i, 1)

      // make ghosts scared
     ghosts.forEach((ghost) => {
         forGhost = true
        ghost.scared = true
      setTimeout(() => {
          ghost.scared = false
          forGhost = false
        }, 10000)
      })
    }
  }
  if(ghosts.some(ghost => ghost.color === "blue")) {
      ghosts.forEach(ghost => ghost.color = "blue")
  }
    player.update(c)  
     for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i]
    // ghost touches player
   if (
      Math.hypot(
        ghost.pos.x - player.pos.x,
        ghost.pos.y - player.pos.y
      ) <
      ghost.r + player.r
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1)
      } else {
        cancelAnimationFrame(animationId)
        console.log('you lose')
      }
    
  }

     }
    
ghosts.forEach((ghost,i) => {
       const collisions = []
      boundaries.forEach((boundary) => {
       boundary.update(c)
    /* circleCollidesWithRectangle({
        circle:ghost,
        rectangle:boundary
    })   */
    if(
       circleCollidesWithRectangle({circle:ghost,rectangle:boundary}) 
    ) {
      ghost.velocity.x = 0
       ghost.velocity.y = 0
      
       
      if (
        !collisions.includes('right') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('right')
      }

      if (
        !collisions.includes('left') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('left')
      }

      if (
        !collisions.includes('up') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed - 2,
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('up')
      }

      if (
        !collisions.includes('down') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed
            }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('down')
      }
      if(collisions.length) {
            ghost.velocity.y = -Ghost.speed
              ghost.velocity.x = 0
      }
      
       if(collisions.includes("right") &&
         !collisions.includes("left") &&
         !collisions.includes("down") &&
         !collisions.includes("up")) {
             cnt++;
             let i = Math.floor(Math.random() * 3) + 1
              ghost.velocity.y = i ?-Ghost.speed:Ghost.speed
              ghost.velocity.x = 0 ;

          }
    
     else if(!collisions.includes("right") &&
         collisions.includes("left") &&
         !collisions.includes("down") &&
         !collisions.includes("up")) {
             let i = Math.floor(Math.random() * 3)
              ghost.velocity.y = i ? Ghost.speed:-Ghost.speed
              ghost.velocity.x = 0
          }
          
     else if(!collisions.includes("right") &&
         !collisions.includes("left") &&
         collisions.includes("down") &&
         !collisions.includes("up")) {
             let i = Math.floor(Math.random() * 3)
              ghost.velocity.x = i ? Ghost.speed:-Ghost.speed
              ghost.velocity.y = 0
          }
     else if(!collisions.includes("right") &&
         !collisions.includes("left") &&
         !collisions.includes("down") &&
         collisions.includes("up")) {
             let i = Math.floor(Math.random() * 3)
              ghost.velocity.x = i ? Ghost.speed:-Ghost.speed
              ghost.velocity.y = 0
        }
        //part2
        else if(!collisions.includes("right") &&
         !collisions.includes("left") &&
         collisions.includes("down") &&
         collisions.includes("up")) {
              ghost.velocity.y = 0
              ghost.velocity.x = cnt%2?-Ghost.speed:Ghost.speed
        }
       else if(!collisions.includes("right") &&
         collisions.includes("left") &&
         !collisions.includes("down") &&
         collisions.includes("up")) {
              ghost.velocity.y = cnt%2?0:Ghost.speed
              ghost.velocity.x = cnt%2? Ghost.speed:0
        }
        else if(!collisions.includes("right") &&
         collisions.includes("left") &&
         collisions.includes("down") &&
         !collisions.includes("up")) {
              ghost.velocity.y = cnt%2?0:-Ghost.speed
              ghost.velocity.x = cnt%2? Ghost.speed:0
        }
        else if(collisions.includes("right") &&
         !collisions.includes("left") &&
         !collisions.includes("down") &&
         collisions.includes("up")) {
               ghost.velocity.y = cnt%2?0:Ghost.speed
              ghost.velocity.x = cnt%2? -Ghost.speed:0
        }
        
        else if(collisions.includes("right") &&
         !collisions.includes("left") &&
         collisions.includes("down") &&
         !collisions.includes("up")) {
              ghost.velocity.y = cnt%2?0:-Ghost.speed
              ghost.velocity.x = cnt%2? Ghost.speed:0
        }
       else if(!collisions.includes("right") &&
         collisions.includes("left") &&
         !collisions.includes("down") &&
         !collisions.includes("up")) {
              ghost.velocity.y = 0
              ghost.velocity.x = Ghost.speed
        }
        //part3
       else if(collisions.includes("right") &&
         !collisions.includes("left") &&
         collisions.includes("down") &&
         collisions.includes("up")) {
              ghost.velocity.y = 0
              ghost.velocity.x = -Ghost.speed
        }
       else if(!collisions.includes("right") &&
         collisions.includes("left") &&
         collisions.includes("down") &&
         collisions.includes("up")) {
              ghost.velocity.y = 0
              ghost.velocity.x = Ghost.speed
        }
        else if(collisions.includes("right") &&
         collisions.includes("left") &&
         !collisions.includes("down") &&
         collisions.includes("up")) {
              ghost.velocity.y = Ghost.speed
              ghost.velocity.x = 0
        }
        else if(collisions.includes("right") &&
         collisions.includes("left") &&
         collisions.includes("down") &&
         !collisions.includes("up")) {
              ghost.velocity.y = cnt%2?-Ghost.speed:Ghost.speed
              ghost.velocity.x = 0
        }else {
            //collision made
        }
        
        
}
})
    ghost.update(c)
  })
 if(pressed.w && lastkey === "w") {
        player.velocity.y = -Player.speed;
    } else if(pressed.a && lastkey === "a" ) {
        player.velocity.x = -Player.speed;
    }else if(pressed.s && lastkey === "s" ) {
        player.velocity.y = Player.speed;
    }else if(pressed.d && lastkey === "d" ) {
        player.velocity.x = Player.speed;
    }else {
        player.velocity.x = 0
        player.velocity.y = 0
    }
   
    if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
  
  
  if(pellets.length === 0) {
      cancelAnimationFrame(animationId)
      alert("You win!!")
  }
  if(cnt>=2000) {
      cnt=0
  }
}
animate()

up.addEventListener("touchstart",moving)
up.addEventListener("touchend",stop)

down.addEventListener("touchstart",moving)
down.addEventListener("touchend",stop)

left.addEventListener("touchstart",moving)
left.addEventListener("touchend",stop)

right.addEventListener("touchstart",moving)
right.addEventListener("touchend",stop)


document.addEventListener("keydown",moving)
document.addEventListener("keyup",stop)

function moving(e) {
  if(e.target.id === "w" || e.key === "w"){
       pressed[e.target.id || e.key] = true
       lastkey = e.target.id || e.key
 }
 if(e.target.id === "a" || e.key === "a"){
       pressed[e.target.id || e.key] = true
       lastkey = e.target.id || e.key
 }
  if(e.target.id === "s" || e.key === "s"){
       pressed[e.target.id || e.key] = true
       lastkey = e.target.id || e.key
 }
  if(e.target.id === "d" || e.key === "d"){
       pressed[e.target.id || e.key] = true
       lastkey = e.target.id || e.key
}
   

}
function stop(e) {
    if(e.target.id === "w" || e.key === "w") {
       pressed[e.target.id || e.key] = false
    }
   if(e.target.id === "a" || e.key === "a") {
       pressed[e.target.id || e.key] = false

    }
   if(e.target.id === "s" || e.key === "s") {
       pressed[e.target.id || e.key] = false

    }
  if(e.target.id === "d" || e.key === "d") {
       pressed[e.target.id || e.key] = false

    }

}
function rcCollision(c,r) {
 return c.pos.y - c.r + c.velocity.y <= r.pos.y + r.h &&
        c.pos.y + c.r + c.velocity.y  >= r.pos.y &&
        c.pos.x + c.r + c.velocity.x  >= r.pos.x &&
        c.pos.x - c.r + c.velocity.x <= r.pos.x + r.w
}

function circleCollidesWithRectangle({ circle, rectangle }) {
  const padding = Boundary.w / 2 - circle.r -1
  return (
    circle.pos.y - circle.r + circle.velocity.y <=
      rectangle.pos.y + rectangle.h + padding &&
    circle.pos.x + circle.r + circle.velocity.x >=
      rectangle.pos.x - padding &&
    circle.pos.y + circle.r + circle.velocity.y >=
      rectangle.pos.y - padding &&
    circle.pos.x - circle.r + circle.velocity.x <=
      rectangle.pos.x + rectangle.w + padding
  )
}
