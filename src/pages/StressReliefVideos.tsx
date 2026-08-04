import { PlayCircle, Wind, ArrowLeft, Home } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const videos = [

  {
    title: "5-Minute Deep Breathing Exercise",
    duration: "5 Minutes",
    description:
      "A simple breathing exercise to reduce stress and calm your mind.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    link:
      "https://www.youtube.com/results?search_query=5+minute+deep+breathing+exercise"
  },

  {
    title: "10-Minute Guided Meditation",
    duration: "10 Minutes",
    description:
      "Guided meditation to improve focus and reduce anxiety.",
    image:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800",
    link:
      "https://www.youtube.com/results?search_query=10+minute+guided+meditation"
  },

  {
    title: "Progressive Muscle Relaxation",
    duration: "15 Minutes",
    description:
      "Relax each muscle group and release built-up tension.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    link:
      "https://www.youtube.com/results?search_query=progressive+muscle+relaxation"
  },

  {
    title: "Stress Relief Yoga",
    duration: "15 Minutes",
    description:
      "Gentle yoga session designed to relieve stress and improve relaxation.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    link:
      "https://www.youtube.com/results?search_query=stress+relief+yoga+beginners"
  },

  {
    title: "Mindfulness for Students",
    duration: "8 Minutes",
    description:
      "Quick mindfulness practice specially helpful during studies and exams.",
    image:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    link:
      "https://www.youtube.com/results?search_query=mindfulness+for+students"
  },

  {
    title: "Sleep Relaxation Meditation",
    duration: "20 Minutes",
    description:
      "Guided relaxation to help calm your thoughts before sleeping.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",
    link:
      "https://www.youtube.com/results?search_query=sleep+relaxation+meditation"
  }

];

export default function StressReliefVideos() {

  const navigate = useNavigate();
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}, []);

  return (

    <div className="container mx-auto py-12 px-5">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-10">

  <Button
  variant="outline"
  onClick={() =>
    navigate("/assessment", {
      state: {
        fromAssessment: true,
      },
    })
  }
>
  <ArrowLeft className="mr-2 h-4 w-4" />
  Back to Assessment
</Button>

  <Button onClick={() => navigate("/")}>
    <Home className="mr-2 h-4 w-4" />
    Back Home
  </Button>

</div>

      <div className="text-center mb-10">

        <Wind className="mx-auto h-16 w-16 text-cyan-600 mb-4" />

        <h1 className="text-4xl font-bold">

          Guided Stress Relief Videos

        </h1>

        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">

          These guided exercises can help reduce stress, improve focus,
          encourage relaxation, and support your emotional wellbeing.
          Choose any video that feels right for you.

        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {videos.map((video) => (

          <div
            key={video.title}
            className="rounded-3xl overflow-hidden shadow-lg bg-white border hover:shadow-xl transition"
          >

            <img
              src={video.image}
              alt={video.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-6">

              <span className="text-sm text-cyan-600 font-semibold">

                {video.duration}

              </span>

              <h2 className="text-xl font-bold mt-2">

                {video.title}

              </h2>

              <p className="mt-3 text-gray-600">

                {video.description}

              </p>

              <button
                onClick={() => window.open(video.link, "_blank")}
                className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-3 font-medium transition"
              >

                <PlayCircle className="inline mr-2" />

                Watch on YouTube

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}