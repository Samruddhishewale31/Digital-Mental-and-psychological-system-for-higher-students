import { useRef, useState } from "react";
import {
  Music2,
  Mic,
  Zap,
  Pause,
  Brain,
  Dumbbell,
  Square,
  Upload
} from "lucide-react";


type VoiceResult = {

  voice_emotion: string;

  wellbeing_cue: string;

  confidence: number;

  voice_score: number;


  features: {

    pitch: number;

    tone: string;

    speaking_speed: number;

    pauses: number;

    hesitation: string;

    voice_confidence: number;

  };

};



const VoiceAnalysis = () => {


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);



  const [recording,setRecording] = useState(false);

  const [audioBlob,setAudioBlob] = useState<Blob | null>(null);

  const [audioUrl,setAudioUrl] = useState("");

  const [result,setResult] = useState<VoiceResult | null>(null);

  const [loading,setLoading] = useState(false);





  const startRecording = async()=>{


    try{


      setResult(null);

      setAudioBlob(null);

      setAudioUrl("");



      const stream =
        await navigator.mediaDevices.getUserMedia({

          audio:true

        });



      const mimeType =
        MediaRecorder.isTypeSupported(
          "audio/webm"
        )
        ?
        "audio/webm"
        :
        "";



      const recorder =
        new MediaRecorder(

          stream,

          mimeType
          ?
          {
            mimeType
          }
          :
          undefined

        );



      mediaRecorderRef.current = recorder;


      audioChunksRef.current=[];




      recorder.ondataavailable=(event)=>{


        if(event.data.size>0)

        {

          audioChunksRef.current.push(
            event.data
          );

        }


      };




      recorder.onstop=()=>{


        const blob =
          new Blob(

            audioChunksRef.current,

            {
              type:
              recorder.mimeType ||
              "audio/webm"
            }

          );



        setAudioBlob(blob);


        setAudioUrl(
          URL.createObjectURL(blob)
        );



        stream
        .getTracks()
        .forEach(
          track=>track.stop()
        );


      };



      recorder.start();


      setRecording(true);



    }

    catch(error)

    {

      console.error(error);

      alert(
        "Microphone permission failed"
      );

    }

  };





  const stopRecording=()=>{


    if(mediaRecorderRef.current)

    {

      mediaRecorderRef.current.stop();

      setRecording(false);

    }


  };






  const analyzeVoice = async () => {

  if (!audioBlob) {
    alert("Please record audio first.");
    return;
  }

  try {

    setLoading(true);

    const formData = new FormData();

    formData.append(
      "audio",
      audioBlob,
      "voice.webm"
    );

    const response = await fetch(
      "http://127.0.0.1:5000/predict-voice",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Voice analysis failed");
    }

    const json = await response.json();

    console.log("VOICE RESPONSE:");
    console.log(json);

    const resultData = json.data ?? json;

    setResult(resultData);

  } catch (error) {

    console.error(error);

    alert("Unable to analyze voice.");

  } finally {

    setLoading(false);

  }

};






return (


<div className="min-h-screen bg-[#f8f6ff] px-6 py-10">


<div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">



<h1 className="text-3xl font-bold text-purple-700">

Voice Emotion Analysis

</h1>




<p className="mt-3 text-gray-600">

This AI module analyzes vocal emotional cues including
pitch, tone, speaking speed, hesitation, pauses and
voice confidence. It provides supportive indicators only
and is not a medical diagnosis.

</p>





<div className="mt-8 rounded-2xl border bg-gray-50 p-6">


<h2 className="text-xl font-semibold">

Record Voice

</h2>



<p className="mt-2 text-sm text-gray-600">

Speak clearly for 5-10 seconds.

</p>




<div className="mt-6 flex gap-4">


{

!recording

?

<button

onClick={startRecording}

className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-white"

>

<Mic size={18}/>

Start Recording

</button>


:


<button

onClick={stopRecording}

className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white"

>

<Square size={18}/>

Stop Recording

</button>


}




<button

onClick={analyzeVoice}

disabled={!audioBlob || loading}

className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white disabled:bg-gray-400"

>


<Upload size={18}/>


{
loading
?
"Analyzing..."
:
"Analyze Voice"
}


</button>



</div>





{

audioUrl &&

<div className="mt-6">


<p className="font-medium">

Audio Preview

</p>


<audio

controls

src={audioUrl}

className="mt-2 w-full"

/>


</div>

}



</div>







{

result &&

<div className="mt-8 rounded-2xl bg-purple-50 p-6">


<h2 className="text-2xl font-bold text-purple-700">

Voice Analysis Result

</h2>



<div className="mt-5 space-y-3">


<p>

<b>Detected Emotion:</b>{" "}

{result.voice_emotion}

</p>



<p>

<b>Emotion Confidence:</b>{" "}

{result.confidence}%

</p>



<p>

<b>Voice Score:</b>{" "}

{result.voice_score}

</p>


<p>

<b>Wellbeing Cue:</b>{" "}

{result.wellbeing_cue}

</p>


</div>







<div className="mt-8 rounded-xl bg-white p-6 shadow">


<h3 className="text-xl font-semibold text-purple-700">

Voice Characteristics

</h3>



<div className="mt-4 space-y-3">


<div className="flex items-center gap-3">
  <Music2 size={20} className="text-purple-600" />
  <span>
    <b>Pitch:</b> {result.features.pitch} Hz
  </span>
</div>


<div className="flex items-center gap-3">
  <Mic size={20} className="text-purple-600" />
  <span>
    <b>Tone:</b> {result.features.tone}
  </span>
</div>


<div className="flex items-center gap-3">
  <Zap size={20} className="text-purple-600" />
  <span>
    <b>Speaking Speed:</b> {result.features.speaking_speed}
  </span>
</div>


<div className="flex items-center gap-3">
  <Pause size={20} className="text-purple-600" />
  <span>
    <b>Pauses:</b> {result.features.pauses} sec
  </span>
</div>


<div className="flex items-center gap-3">
  <Brain size={20} className="text-purple-600" />
  <span>
    <b>Hesitation:</b> {result.features.hesitation}
  </span>
</div>


<div className="flex items-center gap-3">
  <Dumbbell size={20} className="text-purple-600" />
  <span>
    <b>Voice Confidence:</b> {result.features.voice_confidence}%
  </span>
</div>


</div>


</div>







<div className="mt-6 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5">


<b>AI Disclaimer</b>


<p className="mt-2 text-gray-700">

Voice analysis provides supportive emotional
observations only and should not be considered
a psychological diagnosis.

</p>


</div>



</div>


}




</div>


</div>


);


};



export default VoiceAnalysis;