import fs from 'fs'
import express from "express";
import bodyParser from "body-parser";
import path , { dirname } from 'path'
// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui'
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import {  getFirestore , collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth,signInWithPopup, updateProfile , GoogleAuthProvider, signInWithRedirect ,getRedirectResult, createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged  } from "firebase/auth";
// import fetch from 'node-fetch';
import fetch from 'cross-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = "5000";
let state;
let state_condition;
let message
let status_state
// new project -> hci-project-2022
const firebaseConfig = {
    
  };



const app_auth = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
// const provider = new GoogleAuthProvider();
// const login_popup = document.getElementById("")
  

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
  
  //  index.html
app.get("/",  (req,res)=>{
        // console.log("in home get")
        onAuthStateChanged(auth, (user) => {
            if (user) {
                res.status(200);
                res.render('../templates/index',{
                    email : user.email,
                    name : user.displayName,
                    user : user
                })
            } else {
                console.log("user is signed out, please login to perform desired operations....")
                res.status(200)
                message = ""
                status_state = false
                res.render('../templates/index',{
                    user : user,
                    message : "",
                    status_state : status_state
                })
            }
        })
        //   }
        // res.status(200)
        // res.sendFile(path.join(__dirname, '..', 'templates', 'index.html'))
        
})


//search.html
app.get("/search",  (req,res)=>{
    
    res.status(200)
    // res.sendFile(path.join(__dirname, '..', 'templates', 'search.html'))
    // res.render('../templates/search',{})
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/search',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("user is signed out, please login to perform desired operations....")
                message = ""
                status_state = false
                res.render('../templates/search',{
                    user : user,
                    message : "",
                    status_state : status_state
                })
        }
    })
    
}) 

app.get("/results",  (req,res)=>{
    
    res.status(200)
    // res.sendFile(path.join(__dirname, '..', 'templates', 'results.html'))
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            // res.render('../templates/results',{
            //     email : user.email,
            //     name : user.displayName,
            //     user : user
            // })
            res.redirect("/")
        } else {
                console.log("user is signed out, please login to perform desired operations....")

            res.status(200)
            res.render('../templates/login',{
                user : user,
            })
        }
    }) 
}) 

// masters.html
app.get("/masters",  (req,res)=>{
    res.status(200)
    // res.sendFile(path.join(__dirname, '..', 'templates', 'masters.html'))
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/masters',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("user is signed out, please login to perform desired operations....")
                message = ""
                status_state = false
                res.render('../templates/masters',{
                    user : user,
                    message : "",
                    status_state : status_state
                })
        }
    })
}) 

//mba.html
app.get("/mba",  (req,res)=>{
    res.status(200)
    // res.sendFile(path.join(__dirname, '..', 'templates', 'mba.html'))
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/mba',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("user is signed out, please login to perform desired operations....")

                message = ""
                status_state = false
                res.render('../templates/mba',{
                    user : user,
                    message : "",
                    status_state : status_state
                })
        }
    })
}) 

//about.html
app.get("/about",  (req,res)=>{
    
    res.status(200)
    // res.sendFile(path.join(__dirname, '..', 'templates', 'about.html'))
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/about',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("user is signed out, please login to perform desired operations....")

                message = ""
                status_state = false
                res.render('../templates/about',{
                    user : user,
                    message : "",
                    status_state : status_state
                })
        }
    })
    
}) 

// contact.html
app.get("/contact",  (req,res)=>{
    
    res.status(200)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/contact',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("user is signed out, please login to perform desired operations....")

                message = ""
                status_state = false
                res.render('../templates/contact',{
                    user : user,
                    message : "",
                    status_state : status_state
                })
        }
    })   
    //  res.render('../templates/contact',{})

    
}) 

//feedback.html
app.get("/feedback",  (req,res)=>{
    
    res.status(200)
    // res.sendFile(path.join(__dirname, '..', 'templates', 'feedback.html'))
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/feedback',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("user is signed out, please login to perform desired operations....")
            //   res.redirect("/login")
                // message = ""
                // status_state = false
                res.status(200)
                res.render('../templates/feedback',{
                    user : user,
                    message : "",
                    status_state : ""
                })
        }
    })
    
}) 

app.post("/feedback",async (req,res)=>{
    onAuthStateChanged(auth, async(user) => {
        if (user) {
            // res.status(200);
            // res.render('../templates/mba',{
            //     email : user.email,
            //     name : user.displayName,
            //     user : user
            // })
            if(req.method == "POST"){
                let body = req.body
                // console.log(body)   
                state_condition = "feedback"
                await addDataToFirestore(body,state_condition)
                res.status(200)
                res.redirect('/submitted')
            }
        } else {
                console.log("user is signed out, please login to perform desired operations....")

            res.status(200)
            // res.render('../templates/feedback',{
            //     user : user,
            // })
            res.redirect("/login")
        }
    })
   

})

app.get('/submitted',(req,res)=>{
    
    // res.status(200)
    // res.sendFile(path.join(__dirname,'..','templates','display.html'))
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/display',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("user is signed out, please login to perform desired operations....")

            res.status(200)
            // res.render('../templates/login',{
            //     user : user,
            // })
            res.redirect("/login")
        }
    })
})

app.get('/querysubmitted',(req,res)=>{
    
    // res.status(200)
    // res.sendFile(path.join(__dirname,'..','templates','query_display.html'))
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            res.render('../templates/query_display',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                // console.log("user is signed out, please login to perform desired operations....")
                res.status(200);
                res.render('../templates/query_display',{
                    email : "",
                    name : "",
                    user : user
                })
            // res.status(200)
            // res.render('../templates/login',{
            //     user : user,
            // })
            // res.redirect("/login")
        }
    })
})

app.get("/login", (req,res)=>{
        // console.log("in get login")
        // res.sendFile(path.join(__dirname, '..', 'templates', 'login.html'));
        onAuthStateChanged(auth, (user) => {
            if (user) {
                res.status(200);
                res.render('../templates/index',{
                    email : user.email,
                    name : user.displayName,
                    user : user
                })
            } else {
                    console.log("user is signed out, please login to perform desired operations....")

                res.status(200)
                res.render('../templates/login',{
                    user : user,
                })
            }
        })


})

app.get("/signup", (req,res)=>{
    
        console.log("in get signup")
        res.status(200)
        // res.sendFile(path.join(__dirname, '..', 'templates', 'signup.html'));
        onAuthStateChanged(auth, (user) => {
            if (user) {
                res.status(200);
                res.render('../templates/index',{
                    email : user.email,
                    name : user.displayName,
                    user : user
                })
            } else {
                    console.log("user is signed out, please login to perform desired operations....")

                res.status(200)
                res.render('../templates/signup',{
                    user : user,
                })
            }
        })
    
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

// app.get("/list",async (req,res)=>{
        
//         let dat;
//         const name = "Default Data List From Firestore...."
//         const data = await getDataFromFirestore();
//         // console.log(data)
//         res.status(200)
//         res.render('../templates/list.html',{
//             // name : name,
//             // data_obt : data
//         })
// })

// app.get("/filter",async (req,res)=>{
    
//         res.status(200)
//         const data = await getDataFromFirestore();
//         // console.log(data)
//         const name = "Default Filter Data From Firestore...."
//         res.render('../templates/filter.html',{
//             // name : name,
//             // data_obt : data
//         })
// })


// app.get("/filterbydate",async (req,res)=>{
//         let dat;
//         const data = await getDataFromFirestore();
//         // console.log(data)
//         const name = "Filter Data By Date & Time...."
//         const mydata = data.sort((a,b)=>{
//             let dateA = new Date(a.date_time).getTime();
//             let dateB = new Date(b.date_time).getTime();
//             return dateA > dateB ? 1 : -1;
//         })
//         res.status(200)
//         res.render('../templates/filter.html',{
//             // name : name,
//             // data_obt : mydata
//         })
// })

// app.get("/filterbyauthor",async (req,res)=>{
//         let dat;
//         const name = "Filter Data By Author Name...."
//         const data = await getDataFromFirestore();
//         // console.log(data)
//         const mydata = data.sort((a,b)=>{
//             let authorA = a.author_name;
//             let authorB = b.author_name;
//             return authorA > authorB ? 1 : -1;
//         })
//         res.status(200)
//         res.render('../templates/filter.html',{
//             // name : name,
//             // data_obt : mydata
//     })
// })

// app.get("/filterbytitle",async (req,res)=>{
//         let dat;
//         const name = "Filter Data By Blog Title...."
//         const data = await getDataFromFirestore();
//         // console.log(data)
//         const mydata = data.sort((a,b)=>{
//             let blogA = a.blog_title;
//             let blogB = b.blog_title;
//             return blogA > blogB ? 1 : -1;
//         })
//         res.status(200)
//         res.render('../templates/filter.html',{
//             // name  : name,
//             // data_obt : mydata
//     })
// })


app.post("/",async (req,res)=>{
    
        if(req.method == "POST"){
        // }
        // res.status(200)
        // res.sendFile(path.join(__dirname,'..','index.html'));
        // res.render('../templates/index',{})
        onAuthStateChanged(auth, (user) => {
            if (user) {
                res.status(200);
                res.render('../templates/index',{
                    email : user.email,
                    name : user.displayName,
                    user : user
                })
            } else {
                    console.log("user is signed out, please login to perform desired operations....")

                res.status(200)
                res.render('../templates/index',{
                    user : user,
                })
            }
        })
    }
  
})

app.post("/results", (req,res)=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user)
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
                    res.render('../templates/results',{
                        user : user,
                        data_obt : arr
                    })
                
                })
                .catch(error => {
                    // handle the error
                });
            }    
        } else {
                console.log("user is signed out, please login to perform desired operations....")

            res.status(200)
            res.redirect('/login')
        }
    
    })
    })
        
    // })
    // if(req.method == "POST"){
    //     let body = req.body
    //     console.log(body)
    //     let country = String(body.selectCountry)
    //     fetch(`http://universities.hipolabs.com/search?`)
    //     .then(response => {
    //         return response.json()
    //     }).then(data => {
            
    //         let arr = []
    //         let obj = {}
    //         let count = 0
    //         for(let i of data){
    //             if(String(i.alpha_two_code) == String(country)){
    //                 arr.push(i)
    //                 // console.log(i)
    //                 count++;
    //             }
    //             if(count > 15){
    //                 break;
    //             }
    //         }
    //         // console.log(data[0])
    //         res.status(200)
    //         res.render('../templates/index',{
    //             user : user,
    //         })
        
    //     })
    //     .catch(error => {
    //         // handle the error
    //     });
    // }    


app.post("/contact",async (req,res)=>{
    // onAuthStateChanged(auth, async (user) => {
        // if (user) {
            if(req.method == "POST"){
                let body = req.body
                // console.log(body)   
                state_condition = "contact"
                await addDataToFirestore(body,state_condition)
                res.status(200)
                res.redirect('/querysubmitted')
            
            // res.render('../templates/search',{
            //     email : user.email,
            //     name : user.displayName, 
            //     user : user
            // })
        }
        // } else {
                // console.log("user is signed out, please login to perform desired operations....")

            // res.status(200)
            // res.render('../templates/login',{
                // user : user,
            // })
        // }
    // })
       
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
        let fname = body.fname
        let lname = body.lname
        let complete_name = fname+" "+lname
        let complete_mobile = String(body.mobile)
        console.log(complete_name)
        console.log(body.mobile)
        // console.log(body.password)
        
        createUserWithEmailAndPassword(auth, body.email, body.password)
        .then((userCredential) => {
          // Signed in 
          const auth_temp = getAuth();
          const user_temp = auth_temp.currentUser 
            updateProfile(user_temp, {
            displayName: complete_name, phoneNumber:complete_mobile, name: complete_name, email : body.email
            }).then(() => {
            console.log("Profile updated!")
            console.log()
            // ...
            }).catch((error) => {
                console.log("Error , Profile not updated!")
            
            // ...
            });
            const user =  userCredential.user;
            console.log(user.displayName)
            console.log(user.name)
            
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

app.get("/home",  (req,res)=>{
    
    res.status(200)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.status(200);
            console.log("successsssss")
            res.render('../templates/index',{
                email : user.email,
                name : user.displayName,
                user : user
            })
        } else {
                console.log("kjssdkdlsk user is signed out, please login to perform desired operations....")
                console.log("hiiiiiiiiiiiiiiii")
                message = ""
                status_state = false
                res.render('../templates/login',{
                    user : user,
                    message : "",
                    status_state : status_state
                })
        }
    })   
    //  res.render('../templates/contact',{})

    
}) 


app.get("/v1/login",(req,res)=>{
    
    // addEventListener('click',(e)=>{
        signInWithPopup(auth, provider)
        .then((result) => {
           
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(user)

          res.redirect("/")

        }).catch((error) => {
        //   Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          res.redirect("/login")
          console.log("hey hey hey")
        
        });

    // })
    

})



app.listen(port,(req,res)=>{
    console.log(`hi in port ${port} server running`)
    
})

