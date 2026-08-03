import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

import {
  FaBookOpen,
  FaPlus,
  FaSearch,
  FaHeart,
  FaLeaf,
  FaPen,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
  FaFilePdf,
  FaFire,
  FaChartLine,
  FaSmile,
  FaRegLightbulb
} from "react-icons/fa";

import { Button } from "@/components/ui/button";



interface JournalEntry {

id:number;

date:string;

mood:string;

thoughts:string;

feelings:string;

gratitude:string;

reflection:string;

}




const tabs=[

{
id:"thoughts",
name:"Thoughts",
icon:FaPen
},

{
id:"feelings",
name:"Feelings",
icon:FaHeart
},

{
id:"gratitude",
name:"Gratitude",
icon:FaLeaf
},

{
id:"reflection",
name:"Reflection",
icon:FaRegLightbulb
}

];




const moods=[

{
name:"Happy",
icon:FaSmile
},

{
name:"Calm",
icon:FaLeaf
},

{
name:"Neutral",
icon:FaSmile
},

{
name:"Sad",
icon:FaHeart
},

{
name:"Stressed",
icon:FaFire
},

{
name:"Anxious",
icon:FaChartLine
},

{
name:"Hopeful",
icon:FaRegLightbulb
}

];





const prompts={

thoughts:[

"What is on your mind today?",

"Describe your day."

],


feelings:[

"How are you feeling today?",

"What emotion did you experience?"

],


gratitude:[

"What are you grateful for today?",

"Who made your day better?"

],


reflection:[

"What did you learn today?",

"What will you improve tomorrow?"

]

};






const Journal=()=>{


const [entries,setEntries]=useState<JournalEntry[]>([]);


const [activeTab,setActiveTab]=useState("thoughts");


const [isWriting,setIsWriting]=useState(false);


const [editingId,setEditingId]=useState<number|null>(null);


const [search,setSearch]=useState("");



const [selectedMood,setSelectedMood]=useState("Happy");


const [thoughts,setThoughts]=useState("");

const [feelings,setFeelings]=useState("");

const [gratitude,setGratitude]=useState("");

const [reflection,setReflection]=useState("");





useEffect(()=>{


const data=
localStorage.getItem("journal_entries");


if(data){

setEntries(JSON.parse(data));

}


},[]);






const updateStorage=(data:JournalEntry[])=>{


localStorage.setItem(

"journal_entries",

JSON.stringify(data)

);


setEntries(data);


};






const clearForm=()=>{


setThoughts("");

setFeelings("");

setGratitude("");

setReflection("");

setSelectedMood("Happy");

setEditingId(null);

setIsWriting(false);


};






const saveEntry=()=>{


if(
!thoughts &&
!feelings &&
!gratitude &&
!reflection
)

return;




let updated:JournalEntry[];




if(editingId){


updated=entries.map(entry=>

entry.id===editingId

?

{

...entry,

mood:selectedMood,

thoughts,

feelings,

gratitude,

reflection

}

:

entry

);


}

else{


updated=[

{

id:Date.now(),

date:new Date().toISOString(),

mood:selectedMood,

thoughts,

feelings,

gratitude,

reflection

},

...entries

];


}



updateStorage(updated);


clearForm();


};






const editEntry=(entry:JournalEntry)=>{


setThoughts(entry.thoughts);

setFeelings(entry.feelings);

setGratitude(entry.gratitude);

setReflection(entry.reflection);

setSelectedMood(entry.mood);

setEditingId(entry.id);

setIsWriting(true);


};





const deleteEntry=(id:number)=>{


updateStorage(

entries.filter(
e=>e.id!==id
)

);


};






const updateCurrentText=(value:string)=>{


if(activeTab==="thoughts")
setThoughts(value);


if(activeTab==="feelings")
setFeelings(value);


if(activeTab==="gratitude")
setGratitude(value);


if(activeTab==="reflection")
setReflection(value);


};





const currentText=()=>{


switch(activeTab){

case "thoughts":
return thoughts;

case "feelings":
return feelings;

case "gratitude":
return gratitude;

default:
return reflection;

}


};





const filteredEntries=

entries.filter(entry=>

JSON.stringify(entry)

.toLowerCase()

.includes(
search.toLowerCase()
)

);





const totalEntries=entries.length;


const streak=entries.length;



const monthEntries=

entries.filter(entry=>

new Date(entry.date).getMonth()

===

new Date().getMonth()

).length;





const words=

(

thoughts+

feelings+

gratitude+

reflection

)

.trim()

.split(/\s+/)

.filter(Boolean)

.length;



const characters=

(

thoughts+

feelings+

gratitude+

reflection

)

.length;





const exportPDF=()=>{


const pdf=new jsPDF();


pdf.text(

"Digital Wellness Journal",

15,

20

);


let y=35;



entries.forEach((entry,index)=>{


pdf.text(

`Entry ${index+1} - ${entry.mood}`,

15,

y

);


y+=10;


pdf.text(

entry.thoughts || "",

15,

y

);


y+=20;


});


pdf.save(

"journal.pdf"

);


};
return (

<div className="container mx-auto max-w-6xl px-6 py-12">


<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

className="mb-10"

>


<h1 className="text-4xl font-bold flex items-center gap-3">

<FaBookOpen className="text-primary"/>

Digital Wellness Journal

</h1>


<p className="text-muted-foreground mt-3">

A safe space to express thoughts, feelings, gratitude and reflections.

</p>


</motion.div>





{/* Statistics */}

<div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">


<div className="bg-card rounded-2xl shadow p-6">

<FaBookOpen className="text-primary text-2xl"/>

<h2 className="text-3xl font-bold mt-3">

{totalEntries}

</h2>


<p className="text-muted-foreground">

Total Entries

</p>

</div>





<div className="bg-card rounded-2xl shadow p-6">

<FaFire className="text-orange-500 text-2xl"/>


<h2 className="text-3xl font-bold mt-3">

{streak}

</h2>


<p className="text-muted-foreground">

Writing Streak

</p>

</div>






<div className="bg-card rounded-2xl shadow p-6">

<FaChartLine className="text-green-500 text-2xl"/>


<h2 className="text-3xl font-bold mt-3">

{monthEntries}

</h2>


<p className="text-muted-foreground">

This Month

</p>

</div>






<div className="bg-card rounded-2xl shadow p-6">

<FaSmile className="text-yellow-500 text-2xl"/>


<h2 className="text-xl font-bold mt-3">

{selectedMood}

</h2>


<p className="text-muted-foreground">

Current Mood

</p>

</div>


</div>






{/* Search */}


<div className="relative mb-6">


<FaSearch className="absolute left-4 top-4 text-muted-foreground"/>


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search journal entries..."

className="w-full rounded-xl border bg-card py-3 pl-12 pr-4"

/>


</div>







<div className="flex justify-between mb-8">


<Button

onClick={()=>setIsWriting(true)}

>


<FaPlus className="mr-2"/>

New Entry


</Button>





<Button

variant="outline"

disabled={entries.length===0}

onClick={exportPDF}

>


<FaFilePdf className="mr-2"/>

Export PDF


</Button>


</div>








{/* Editor */}


{
isWriting &&

(

<motion.div

initial={{
opacity:0,
scale:0.95
}}

animate={{
opacity:1,
scale:1
}}

className="bg-card rounded-3xl shadow p-8 mb-10"

>



<h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">

<FaPen className="text-primary"/>

Write Journal

</h2>







<div className="flex flex-wrap gap-3 mb-8">


{

tabs.map(tab=>{


const Icon=tab.icon;


return(


<button

key={tab.id}

onClick={()=>setActiveTab(tab.id)}

className={

`flex items-center gap-2 px-5 py-3 rounded-xl

${

activeTab===tab.id

?

"bg-primary text-primary-foreground"

:

"bg-muted"

}`

}

>


<Icon/>

{tab.name}


</button>


)

})

}


</div>







<div className="mb-6">


<h3 className="font-medium mb-3">

Reflection Prompts

</h3>



<div className="flex flex-wrap gap-3">


{

prompts[activeTab as keyof typeof prompts]

.map(prompt=>(


<button

key={prompt}

onClick={()=>updateCurrentText(prompt+" ")}

className="px-4 py-2 rounded-full bg-muted text-sm"

>


{prompt}


</button>


))


}


</div>


</div>







<h3 className="font-medium mb-4">

How are you feeling?

</h3>



<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">


{

moods.map(mood=>{


const Icon=mood.icon;


return(


<button

key={mood.name}

onClick={()=>setSelectedMood(mood.name)}

className={

`p-4 rounded-2xl border flex flex-col items-center

${

selectedMood===mood.name

?

"border-primary bg-primary/10"

:

""

}`

}

>


<Icon className="text-xl"/>


<span>

{mood.name}

</span>


</button>


)


})

}


</div>








<textarea

value={currentText()}

onChange={(e)=>updateCurrentText(e.target.value)}

placeholder="Write your thoughts..."

className="w-full min-h-[250px] rounded-2xl border bg-background p-5 resize-none"

/>







<div className="flex justify-end gap-5 text-sm mt-3 text-muted-foreground">


<span>

Words: {words}

</span>


<span>

Characters: {characters}

</span>


</div>







<div className="flex justify-between mt-8">


<Button

variant="outline"

onClick={clearForm}

>

Cancel

</Button>





<Button

onClick={saveEntry}

>

Save Journal Entry

</Button>


</div>





</motion.div>


)

}
{/* Journal History */}

<div className="mt-12">


<h2 className="text-2xl font-bold mb-6 flex items-center gap-3">


<FaBookOpen className="text-primary"/>

Your Journal Entries


</h2>





{
filteredEntries.length===0

?

(

<div className="text-center py-16 bg-card rounded-3xl shadow">


<FaBookOpen className="mx-auto text-5xl text-muted-foreground mb-5"/>


<h3 className="text-xl font-semibold">

No journal entries yet

</h3>


<p className="text-muted-foreground mt-2">

Start writing your thoughts, feelings and reflections.

</p>


</div>

)


:

(


<div className="space-y-6">


<AnimatePresence>


{

filteredEntries.map(entry=>(


<motion.div


key={entry.id}


initial={{

opacity:0,

y:20

}}


animate={{

opacity:1,

y:0

}}



exit={{

opacity:0

}}


className="bg-card rounded-3xl shadow p-7"


>







<div className="flex flex-col md:flex-row justify-between gap-4 mb-5">



<div>


<h3 className="text-xl font-semibold">

Journal Entry

</h3>



<div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">


<FaCalendarAlt/>


{

new Date(entry.date)

.toLocaleDateString(

"en-US",

{

weekday:"long",

year:"numeric",

month:"long",

day:"numeric"

}

)

}


</div>


</div>







<div className="flex gap-3 items-center">


<span className="px-4 py-2 rounded-full bg-primary/10 text-primary">


{entry.mood}


</span>





<Button


variant="outline"

size="sm"

onClick={()=>editEntry(entry)}

>


<FaEdit className="mr-2"/>

Edit


</Button>






<Button


variant="destructive"

size="sm"

onClick={()=>deleteEntry(entry.id)}

>


<FaTrash className="mr-2"/>

Delete


</Button>



</div>


</div>









<div className="space-y-5">





{

entry.thoughts &&

(

<div>


<h4 className="font-semibold flex items-center gap-2">


<FaPen/>

Thoughts


</h4>


<p className="mt-2 text-muted-foreground whitespace-pre-wrap">

{entry.thoughts}

</p>


</div>

)

}








{

entry.feelings &&

(

<div>


<h4 className="font-semibold flex items-center gap-2">


<FaHeart/>

Feelings


</h4>


<p className="mt-2 text-muted-foreground whitespace-pre-wrap">

{entry.feelings}

</p>


</div>

)

}








{

entry.gratitude &&

(

<div>


<h4 className="font-semibold flex items-center gap-2">


<FaLeaf/>

Gratitude


</h4>


<p className="mt-2 text-muted-foreground whitespace-pre-wrap">

{entry.gratitude}

</p>


</div>

)

}








{

entry.reflection &&

(

<div>


<h4 className="font-semibold flex items-center gap-2">


<FaRegLightbulb/>

Reflection


</h4>


<p className="mt-2 text-muted-foreground whitespace-pre-wrap">

{entry.reflection}

</p>


</div>

)

}





</div>





</motion.div>


))


}


</AnimatePresence>


</div>


)


}


</div>





</div>

);

};


export default Journal;