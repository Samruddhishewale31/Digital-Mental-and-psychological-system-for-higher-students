import {
  Music,
  PlayCircle,
  ArrowLeft
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const musicList = [
  {
    title: "Lofi Study Music",
    description: "Relaxing beats for studying and concentration.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    link:
      "https://www.youtube.com/results?search_query=lofi+study+music",
  },

  {
    title: "Nature Sounds",
    description: "Calming rain, birds and forest ambience.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    link:
      "https://www.youtube.com/results?search_query=nature+sounds+relaxation",
  },

  {
    title: "Relaxing Piano",
    description: "Peaceful instrumental piano music.",
    image:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800",
    link:
      "https://www.youtube.com/results?search_query=relaxing+piano+music",
  },

  {
    title: "Guided Meditation",
    description: "Meditation for reducing stress and anxiety.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    link:
      "https://www.youtube.com/results?search_query=guided+meditation+for+stress",
  },

  {
    title: "Sleep Music",
    description: "Soft music for deep relaxation.",
    image:
      "https://images.unsplash.com/photo-1511296265581-c2450046447d?w=800",
    link:
      "https://www.youtube.com/results?search_query=sleep+music+relaxation",
  },

  {
    title: "Calm Mind Playlist",
    description: "Music to help reduce anxiety.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
    link:
      "https://www.youtube.com/results?search_query=calming+music+for+anxiety",
  },
];

export default function RelaxingMusic() {

  const navigate = useNavigate();

  return (
     <div className="container mx-auto py-12 px-5">

  <div className="mb-8">

    <Button
      variant="outline"
      onClick={() => navigate(-1)}
    >

      <ArrowLeft className="mr-2 h-4 w-4" />

      Back to Assessment

    </Button>

  </div>

      <h1 className="text-4xl font-bold text-center mb-3">

        <Music className="inline mr-2" />

        Relaxing Music Library

      </h1>

      <p className="text-center text-muted-foreground mb-10">

        Choose a playlist that helps you relax and recharge.

      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {musicList.map((music) => (

          <div
            key={music.title}
            className="rounded-3xl overflow-hidden shadow-lg bg-white"
          >

            <img
              src={music.image}
              alt={music.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">

              <h2 className="font-bold text-xl">

                {music.title}

              </h2>

              <p className="mt-3 text-gray-600">

                {music.description}

              </p>

              <button
                onClick={() => window.open(music.link, "_blank")}
                className="mt-6 w-full bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700"
              >

                <PlayCircle className="inline mr-2" />

                Listen on YouTube

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}