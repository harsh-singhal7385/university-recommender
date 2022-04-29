import fs from 'fs'
import express from "express";
import bodyParser from "body-parser";
import path , { dirname } from 'path'
// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui'
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import {  getFirestore , collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth,signInWithPopup, GoogleAuthProvider, signInWithRedirect ,getRedirectResult, createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged  } from "firebase/auth";
// import fetch from 'node-fetch';
import fetch from 'cross-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = "5000";
let state;
let state_condition;

// new project -> hci-project-2022
const firebaseConfig = {
    apiKey: "AIzaSyCWh-zBasdCY3Kl4Vnwkdczzg3XZ5ijHC4",
    authDomain: "hci-project-2022.firebaseapp.com",
    projectId: "hci-project-2022",
    storageBucket: "hci-project-2022.appspot.com",
    messagingSenderId: "780302222864",
    appId: "1:780302222864:web:eaec90fbe8fa940f096c95",
    measurementId: "G-0XCZ9BCWXV"
  };



const app_auth = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();



const db = getFirestore();
async function getDataFromFirestore(){
    let data_ans = [];
    const querySnapshot = await getDocs(collection(db, "feedback_info"));
    querySnapshot.forEach((doc) => {
        data_ans.push(doc.data())
    }
)
// console.log(data_ans)
return data_ans
      
}

async function addDataToFirestore(body,state_condition){
    if(state_condition == "feedback"){
        try {
            const docRef = await addDoc(collection(db, "feedback_info"), { 
              user_name : body['user-name'],
              user_degree : body['user-degree'],
              user_email : body['user-email'],
              user_phone : body['user-phone'],
              user_feedback : body['user-feedback'],
              date_time : new Date().toUTCString()
            
            });
            // console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }else{

        try {
            const docRef = await addDoc(collection(db, "contact_info"), { 
            user_name : body['user-name'],
            user_degree : body['user-degree'],
            user_email : body['user-email'],
            user_phone : body['user-phone'],
            user_contact : body['user-contact'],
            date_time : new Date().toUTCString()
            
            });
            // console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

}




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'..', 'templates')); 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname,'..', 'public')))

onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      
    } else {
      // User is signed out
    }
  });  


  //  index.html
app.get("/",  (req,res)=>{
        // console.log("in home get")
        res.status(200)
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
        
}) 


//search.html
app.get("/search",  (req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname, '..', 'public', 'search.html'))
    
}) 

app.get("/results",  (req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname, '..', 'public', 'results.html'))
    
}) 

// masters.html
app.get("/masters",  (req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname, '..', 'public', 'masters.html'))
    
}) 

//mba.html
app.get("/mba",  (req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname, '..', 'public', 'mba.html'))
    
}) 

//about.html
app.get("/about",  (req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname, '..', 'public', 'about.html'))
    
}) 

// contact.html
app.get("/contact",  (req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'))
    
}) 

//feedback.html
app.get("/feedback",  (req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname, '..', 'public', 'feedback.html'))
    
}) 

app.post("/feedback",async (req,res)=>{

    if(req.method == "POST"){
        let body = req.body
        // console.log(body)   
        state_condition = "feedback"
        await addDataToFirestore(body,state_condition)
        res.status(200)
        res.redirect('/submitted')
    }

})

app.get('/submitted',(req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname,'..','public','display.html'))
})

app.get('/querysubmitted',(req,res)=>{
    
    res.status(200)
    res.sendFile(path.join(__dirname,'..','public','query_display.html'))
})

app.get("/login", (req,res)=>{
        // console.log("in get login")
        res.status(200)
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));


})

app.get("/signup", (req,res)=>{
        // console.log("in get signup")
        res.status(200)
        res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
    
})



app.get("/logout",(req,res)=>{
    // console.log("hi in get of / logout")
    state = "false"
    auth.signOut()
    .then(()=>{
        // console.log("user logout success")
        res.status(200)
        res.redirect('/demologout1')
    })
    .catch((err)=>{
        // console.log("error in logout of app , redirecting to home page if logged in")
        res.status(400)
        res.redirect('/')
    })
    
})

app.get('/demologout1',(req,res)=>{
    
    res.redirect('/demologout2')
    
})

app.get('/demologout2',(req,res)=>{
    
    res.redirect('/demologout3')
})

app.get('/demologout3',(req,res)=>{
    
    res.redirect('/login')
})

// app.get("/create",async (req,res)=>{
        // res.status(200)
        // res.sendFile(path.join(__dirname+'/templates/create.html'));
// })

app.get("/list",async (req,res)=>{
        
        let dat;
        const name = "Default Data List From Firestore...."
        const data = await getDataFromFirestore();
        // console.log(data)
        res.status(200)
        res.render('../templates/list.ejs',{
            // name : name,
            // data_obt : data
        })
})

app.get("/filter",async (req,res)=>{
    
        res.status(200)
        const data = await getDataFromFirestore();
        // console.log(data)
        const name = "Default Filter Data From Firestore...."
        res.render('../templates/filter.ejs',{
            // name : name,
            // data_obt : data
        })
})


app.get("/filterbydate",async (req,res)=>{
    

        let dat;
    
        const data = await getDataFromFirestore();
        // console.log(data)
        const name = "Filter Data By Date & Time...."
        const mydata = data.sort((a,b)=>{
            let dateA = new Date(a.date_time).getTime();
            let dateB = new Date(b.date_time).getTime();
            return dateA > dateB ? 1 : -1;
        })
        
        
        res.status(200)
        res.render('../templates/filter.ejs',{
            // name : name,
            // data_obt : mydata
        })

 
})

app.get("/filterbyauthor",async (req,res)=>{
    
  
        let dat;
        const name = "Filter Data By Author Name...."
        const data = await getDataFromFirestore();
        // console.log(data)
        const mydata = data.sort((a,b)=>{
            let authorA = a.author_name;
            let authorB = b.author_name;
            return authorA > authorB ? 1 : -1;
        })
        
        res.status(200)
        res.render('../templates/filter.ejs',{
            // name : name,
            // data_obt : mydata
    })
    
   
    
})

app.get("/filterbytitle",async (req,res)=>{
    
    
  
        let dat;
        const name = "Filter Data By Blog Title...."
        const data = await getDataFromFirestore();
        // console.log(data)
        const mydata = data.sort((a,b)=>{
            let blogA = a.blog_title;
            let blogB = b.blog_title;
            return blogA > blogB ? 1 : -1;
        })
        
        res.status(200)
        res.render('../templates/filter.ejs',{
            // name  : name,
            // data_obt : mydata
    
    })
    

})


app.post("/",async (req,res)=>{
    
        if(req.method == "POST"){
            let body = req.body
            // console.log(body)
        }
        res.status(200)
        res.sendFile(path.join(__dirname,'..','index.html'));
        var select = document.getElementById('language');
        // var value = select.options[select.selectedIndex].value;
  
})

app.post("/results",async (req,res)=>{
    
    if(req.method == "POST"){
        let body = req.body
        console.log(body)
        let country = String(body.selectCountry)
        fetch(`http://universities.hipolabs.com/search?`)
        .then(response => {
            return response.json()
        }).then(data => {
            
            let arr = []
            let obj = {}
            let count = 0
            for(let i of data){
                if(String(i.alpha_two_code) == String(country)){
                    arr.push(i)
                    // console.log(i)
                    count++;
                }
                if(count > 15){
                    break;
                }
            }
            // console.log(data[0])
            res.status(200)
            res.render('results.ejs',{ 
                data_obt : arr
        })

        })
        .catch(error => {
            // handle the error
        });
    }    
})

app.post("/contact",async (req,res)=>{
        if(req.method == "POST"){
            let body = req.body
            // console.log(body)   
            state_condition = "contact"
            await addDataToFirestore(body,state_condition)
            res.status(200)
            res.redirect('/querysubmitted')
        }
})

app.post("/login",  (req,res)=>{
    console.log("hi in post of / login ")  
    
    if(req.method == "POST"){
        let body = req.body
        // console.log(body)   
        signInWithEmailAndPassword(auth, body.email, body.password)
        .then((userCredential) => {
        
            const user = userCredential.user;
            console.log(user)
            res.status(200)
            console.log("success login")
            res.redirect('/')
        
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(400)
            console.log("failure login")
            res.redirect('/login')
        });
    }

})

app.post("/signup",  (req,res)=>{
    console.log("hi in post of / signup") 
    
    if(req.method == "POST"){
        let body = req.body
        // console.log(body)
        
        createUserWithEmailAndPassword(auth, body.email, body.password)
        .then((userCredential) => {
          // Signed in 
            const user =  userCredential.user;
            console.log(user)
            res.status(200)
            // console.log("success signup")
            res.redirect('/')
          // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log(errorMessage)
            res.status(400)
            console.log("failure signup")
            res.redirect('/signup')
        
        });
    }
})



app.listen(port,(req,res)=>{
    console.log(`hi in port ${port} server running`)
    
})

