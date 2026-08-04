export interface Counsellor {
  id: number;
  name: string;
  specialization: string;
  designation: string;
  qualification: string;
  experience: number;
  rating: number;
  totalReviews: number;
  languages: string[];
  mode: ("Online" | "Offline")[];
  availableToday: boolean;
  image: string;

  studentSupportCentre: string;
  campusLocation: string;
  sessionDuration: string;

  about: string;

  expertise: string[];
}

export const counsellors: Counsellor[] = [

{
id:1,
name:"Dr. Priya Sharma",
designation:"Senior Student Counsellor",
specialization:"Academic Stress & Anxiety",
qualification:"PhD Clinical Psychology",
experience:12,
rating:4.9,
totalReviews:248,
languages:["English","Hindi","Marathi"],
mode:["Online","Offline"],
availableToday:true,
studentSupportCentre:"Student Wellness Centre",
campusLocation:"Main Campus",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/women/44.jpg",
about:"Dr. Priya Sharma supports students experiencing academic pressure, examination stress, anxiety, adjustment challenges and emotional wellbeing concerns. She believes in creating a safe, confidential and supportive environment where students can openly discuss personal and academic challenges.",
expertise:[
"Academic Stress",
"Anxiety",
"Exam Pressure",
"Student Wellbeing"
]
},

{
id:2,
name:"Dr. Rohan Kulkarni",
designation:"Clinical Psychologist",
specialization:"Depression & Emotional Wellbeing",
qualification:"MPhil Clinical Psychology",
experience:10,
rating:4.8,
totalReviews:212,
languages:["English","Hindi"],
mode:["Offline"],
availableToday:false,
studentSupportCentre:"Student Wellness Centre",
campusLocation:"Health Centre",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/men/32.jpg",
about:"Dr. Rohan Kulkarni works closely with students experiencing prolonged sadness, emotional distress, low motivation and personal challenges while encouraging healthy coping strategies.",
expertise:[
"Depression",
"Mood Disorders",
"Emotional Wellbeing"
]
},

{
id:3,
name:"Dr. Neha Joshi",
designation:"Student Counsellor",
specialization:"Exam Anxiety & Career Guidance",
qualification:"PhD Psychology",
experience:8,
rating:4.8,
totalReviews:178,
languages:["English","Hindi","Gujarati"],
mode:["Online"],
availableToday:true,
studentSupportCentre:"Career & Wellness Centre",
campusLocation:"Academic Block",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/women/68.jpg",
about:"Dr. Neha Joshi helps students overcome examination anxiety, career confusion and confidence related concerns while promoting emotional resilience.",
expertise:[
"Exam Anxiety",
"Career Guidance",
"Student Counselling"
]
},

{
id:4,
name:"Dr. Aditi Mehta",
designation:"Counselling Psychologist",
specialization:"Burnout & Lifestyle Management",
qualification:"Clinical Psychologist",
experience:9,
rating:4.8,
totalReviews:186,
languages:["English","Hindi"],
mode:["Online","Offline"],
availableToday:true,
studentSupportCentre:"Student Wellness Centre",
campusLocation:"Counselling Office",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/women/65.jpg",
about:"Supports students dealing with burnout, academic overload, stress management and maintaining a healthy study-life balance.",
expertise:[
"Burnout",
"Stress",
"Lifestyle Balance"
]
},

{
id:5,
name:"Dr. Arjun Nair",
designation:"Career Counsellor",
specialization:"Career Planning",
qualification:"Counselling Psychologist",
experience:7,
rating:4.7,
totalReviews:150,
languages:["English","Hindi","Malayalam"],
mode:["Online"],
availableToday:true,
studentSupportCentre:"Career Development Cell",
campusLocation:"Placement Office",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/men/41.jpg",
about:"Assists students with career planning, confidence building, goal setting and personal growth.",
expertise:[
"Career Guidance",
"Confidence",
"Decision Making"
]
},

{
id:6,
name:"Dr. Sneha Patil",
designation:"Clinical Psychologist",
specialization:"Stress & Anxiety",
qualification:"Clinical Psychologist",
experience:11,
rating:4.9,
totalReviews:261,
languages:["English","Hindi","Marathi"],
mode:["Online","Offline"],
availableToday:false,
studentSupportCentre:"Student Wellness Centre",
campusLocation:"Main Campus",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/women/23.jpg",
about:"Provides evidence-based counselling for anxiety, stress management and emotional resilience among university students.",
expertise:[
"Stress",
"Anxiety",
"CBT"
]
},

{
id:7,
name:"Dr. Meera Rao",
designation:"Relationship Counsellor",
specialization:"Relationships & Self Esteem",
qualification:"Counselling Psychologist",
experience:13,
rating:4.9,
totalReviews:291,
languages:["English","Hindi","Kannada"],
mode:["Online"],
availableToday:true,
studentSupportCentre:"Student Wellness Centre",
campusLocation:"Student Activity Centre",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/women/52.jpg",
about:"Supports students dealing with interpersonal relationships, communication, self-esteem and emotional growth.",
expertise:[
"Relationships",
"Self Esteem",
"Communication"
]
},

{
id:8,
name:"Dr. Vivek Kapoor",
designation:"Clinical Psychologist",
specialization:"Sleep & Emotional Wellness",
qualification:"Clinical Psychologist",
experience:15,
rating:5,
totalReviews:340,
languages:["English","Hindi","Punjabi"],
mode:["Offline"],
availableToday:true,
studentSupportCentre:"Health & Wellness Centre",
campusLocation:"Medical Centre",
sessionDuration:"45 Minutes",
image:"https://randomuser.me/api/portraits/men/55.jpg",
about:"Works with students experiencing sleep difficulties, emotional fatigue, stress and overall wellbeing concerns.",
expertise:[
"Sleep",
"Mental Wellness",
"Stress"
]
}

];