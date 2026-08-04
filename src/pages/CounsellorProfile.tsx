import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { counsellors } from "@/data/counsellors";

import ProfileHeader from "@/components/ProfileHeader";
import AboutSection from "@/components/AboutSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import AvailabilitySection from "@/components/AvailabilitySection";
import SimilarCounsellors from "@/components/SimilarCounsellors";

export default function CounsellorProfile() {

    const navigate = useNavigate();

    const { id } = useParams();

    const counsellor = useMemo(() => {

        return counsellors.find(
            c => c.id === Number(id)
        );

    }, [id]);

    if (!counsellor) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-3xl font-bold">

                        Counsellor Not Found

                    </h2>

                    <Button
                        className="mt-6"
                        onClick={() => navigate("/counsellors")}
                    >

                        Go Back

                    </Button>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-[#F8F6FF] py-10">

            <div className="max-w-7xl mx-auto px-6">

                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                >

                    <ArrowLeft className="mr-2 h-4 w-4"/>

                    Back

                </Button>

                <ProfileHeader counsellor={counsellor} />

                <AboutSection counsellor={counsellor} />

                <ExpertiseSection counsellor={counsellor} />

                <AvailabilitySection counsellor={counsellor} />

                <SimilarCounsellors
                    currentId={counsellor.id}
                />

            </div>

        </div>

    );

}