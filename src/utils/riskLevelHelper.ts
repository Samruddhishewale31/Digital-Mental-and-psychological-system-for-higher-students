export const getAnxietyLevel = (score:number) => {

  if(score <= 3) return "Minimal";
  if(score <= 6) return "Mild";
  if(score <= 9) return "Moderate";

  return "Severe";

};


export const getDepressionLevel = (score:number) => {

  if(score <= 4) return "Minimal";
  if(score <= 8) return "Mild";
  if(score <= 13) return "Moderate";

  return "Severe";

};