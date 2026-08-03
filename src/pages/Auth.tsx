import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Auth = () => {

const [searchParams] = useSearchParams();

const navigate = useNavigate();


const [isRegister,setIsRegister]=useState(
searchParams.get("register")==="true"
);


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [name,setName]=useState("");


const [loading,setLoading]=useState(false);



const handleSubmit = async(e:React.FormEvent)=>{


e.preventDefault();


setLoading(true);



try{


// REGISTER

if(isRegister){


const {data,error}=await supabase.auth.signUp({

email,

password,


options:{

data:{

full_name:name

}

}

});



if(error){

alert(error.message);

return;

}



alert(
"Account created successfully!"
);



navigate("/journal");



}




// LOGIN

else{


const {data,error}=await supabase.auth.signInWithPassword({

email,

password

});



if(error){

alert(error.message);

return;

}



alert(
"Login successful!"
);



await supabase.auth.signInWithPassword({
 email,
 password
});

navigate("/journal");


}



}
finally{


setLoading(false);


}


};



return (

<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">


<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

className="max-w-md w-full p-10 bg-card rounded-[32px] shadow-float"

>


<div className="text-center mb-8">


<Heart className="w-10 h-10 text-primary mx-auto mb-4 fill-primary/20"/>


<h1 className="text-2xl font-bold mb-1">

{isRegister?
"Create Account":
"Welcome Back"}

</h1>


<p className="text-muted-foreground text-sm">

{isRegister?
"Join our supportive community.":
"We're glad you're here."}

</p>


</div>




<form 
onSubmit={handleSubmit}
className="space-y-4"
>



{
isRegister &&

<div className="relative">

<User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>


<input

type="text"

placeholder="Full Name"

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full pl-11 pr-4 py-3 bg-muted/50 rounded-2xl"

required

/>

</div>

}



<div className="relative">

<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>


<input

type="email"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full pl-11 pr-4 py-3 bg-muted/50 rounded-2xl"

required

/>

</div>




<div className="relative">


<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>


<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full pl-11 pr-4 py-3 bg-muted/50 rounded-2xl"

required

/>


</div>




<Button 
type="submit"
size="lg"
className="w-full"
disabled={loading}
>


{
loading?
"Please wait...":
isRegister?
"Create Account":
"Login"
}


</Button>


</form>





<p className="text-center text-sm text-muted-foreground mt-6">


{
isRegister?
"Already have an account?":
"Don't have an account?"
}


<button

onClick={()=>setIsRegister(!isRegister)}

className="text-primary font-medium ml-1 hover:underline"

>


{
isRegister?
"Login":
"Register"
}


</button>


</p>



</motion.div>


</div>


);


};


export default Auth;