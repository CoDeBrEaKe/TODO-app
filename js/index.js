// selecting the icons to activate dark mood

let stars = document.querySelectorAll("header img"); 
let backgroud = document.documentElement.style.backgroundImage;
let newTodo = document.querySelector("main .new input");
let tasks = document.querySelector("main .tasks");
let left = document.querySelector("main .details .left span");
let clear = document.querySelector("main .details .clear");
let error = document.querySelector("main .error");
let category = document.querySelectorAll(".category span");

// organizing 
category.forEach(cat=>{
    cat.onclick = function (){
        let list = document.querySelectorAll(".tasks .task");
        list.forEach(item=>{item.style.display="flex";});
            list.forEach(item=>{
                
            if(!item.classList.contains(cat.className))
            {
                item.style.display="none";
            }
            
        })
    } 
})

localStorage.getItem("mode") ? activateMode(localStorage.getItem("mode")):localStorage.setItem("mode" , "dark");
if (!localStorage.getItem('list'))
localStorage.setItem('list' , '[]')

if (localStorage.getItem('list') != "[]") 
{
    let items = JSON.parse(localStorage.getItem('list'));
    items.forEach(item=>{
        addTask(item);
    });
    left.innerHTML = `${items.length}`;
}else{
    localStorage.setItem('list' ,"[]");
}

stars.forEach(star => {
    star.onclick = function(){
        if (star.className == "sun")
        {
            star.style.display = "none"
            document.querySelector("header .moon").style.display="block";
            localStorage.setItem("mode" , "light");
            activateMode(localStorage.getItem("mode"))
        }else{
            star.style.display = "none"
            document.querySelector("header .sun").style.display="block";
            localStorage.setItem("mode" , "dark");
            activateMode(localStorage.getItem("mode"));
        }
    }
});

function activateMode(mode){
    if (mode == "light"){
        document.querySelector("header .sun").style.display = "none"
        document.querySelector("header .moon").style.display="block";
        document.documentElement.style.setProperty("--main-background" , `url(../images/bg-desktop-light.jpg)`);
        document.documentElement.style.setProperty("--body-color" , `hsl(236, 33%, 92%)`);
        document.documentElement.style.setProperty("--content-backcolor" , `white`);
        document.documentElement.style.setProperty("--text-color" , `hsl(235, 19%, 35%)`);
    }else{
        document.querySelector("header .moon").style.display = "none"
        document.querySelector("header .sun").style.display="block";
        document.documentElement.style.setProperty("--main-background" , `url(../images/bg-desktop-dark.jpg)`);
        document.documentElement.style.setProperty("--body-color" , `hsl(235, 21%, 11%)`);
        document.documentElement.style.setProperty("--content-backcolor" , `hsl(235, 24%, 19%)`);
        document.documentElement.style.setProperty("--text-color" , `white`);
    }
}
// handling enter on the input  

function addTask(object){
    let shouldSkip= false;
    if (object.text){
        let storage = JSON.parse(localStorage.getItem('list'))
        storage.forEach(item=>{
            if (newTodo.value == item.text)
            {
                console.log(newTodo.value)
                console.log(item.text)
                error.style.display="block";
                setTimeout( ()=>{
                    error.style.display="none";
                },3000 )
                shouldSkip = true;
            }
            
        })
        if (shouldSkip == true)
        return false;
        // creating the elements of the task
        let task = document.createElement("div");
        task.className="task";
        let completeDiv = document.createElement("div");
        completeDiv.className="complete";
        let image = document.createElement("img");
        image.src="images/icon-check.svg";
        image.alt="check";
        completeDiv.appendChild(image);
        task.appendChild(completeDiv);
        let span = document.createElement("span");
        span.innerHTML = object.text;
        span.className= "text";
        let cross = document.createElement("img");
        cross.src="images/icon-cross.svg";
        cross.alt="cross";
        cross.className="cross";
        completeDiv.parentNode.classList.add("all");
        if (object.completed == false){
            image.style.display="none";
            completeDiv.style.backgroundImage = 'none'; 
            completeDiv.parentNode.classList.add("active");
        }else{
            image.style.display="block";
            completeDiv.style.backgroundImage = 'linear-gradient(to bottom right,hsl(192, 100%, 67%) ,hsl(280, 87%, 65%))'; 
            completeDiv.parentNode.classList.add("completed");
        }
        completeDiv.onclick =function(e){
            completeDiv.parentNode.classList.toggle("completed");
            completeDiv.parentNode.classList.toggle("active");
            image.style.display == 'none' ? image.style.display = "block" :image.style.display = 'none' ;
            completeDiv.style.backgroundImage == "none"? completeDiv.style.backgroundImage = "linear-gradient(to bottom right,hsl(192, 100%, 67%) ,hsl(280, 87%, 65%))" :completeDiv.style.backgroundImage = "none" ;

            object.completed = !object.completed;
            let myArray = JSON.parse(localStorage.getItem('list'));
            myArray.forEach(obj =>{
                if (obj.text == object.text){
                    obj.completed = !obj.completed;
                    return ;
                } 
            })
            localStorage.setItem('list' , JSON.stringify(myArray));
        }
        cross.onclick = function(){
            cross.parentElement.remove();
            let array = JSON.parse(localStorage.getItem('list'));
            array.forEach((obj ,index) =>{
                if(obj.text ==span.innerHTML)
                array.splice(index , 1);
            });
            localStorage.setItem('list',JSON.stringify(array));
            left.innerHTML = `${array.length}`;
        }

        task.appendChild(span);
        task.appendChild(cross);
        let tasks = document.querySelector("main .tasks");
        
        tasks.insertBefore(task , tasks.children[0]);
        newTodo.value=""
        return true
    }
}


newTodo.addEventListener('keyup' , (event) =>{
    if (event.keyCode == 13){
        // create object of all data
        let myObject = {text :"" , completed : false}
        myObject.text = newTodo.value.toString().trim();
        if (addTask(myObject)){
        // Adding the new item to the local storage
        let myArray = JSON.parse(localStorage.getItem('list'));
        myArray.push(myObject);
        localStorage.setItem('list' , JSON.stringify(myArray));
        }
    
    left.innerHTML =JSON.parse(localStorage.getItem('list')).length;
}
});


clear.onclick = function (){

    // Clearing them from the UI
    let tasks = document.querySelectorAll(".tasks .task");
    tasks.forEach(task=>{
        if (task.classList.contains('completed')){
            task.remove();
        }
    })
    let myArray = JSON.parse(localStorage.getItem('list'));
    let filtered = myArray.filter(obj=>{
        return obj.completed==false;
    })
    localStorage.setItem('list' , JSON.stringify(filtered));
    left.innerHTML =JSON.parse(localStorage.getItem('list')).length;
}
