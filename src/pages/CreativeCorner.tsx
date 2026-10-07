import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Brush,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  Eraser,
  Heart,
  Palette,
  PaintBucket,
  Redo2,
  RotateCcw,
  Save,
  Sparkles,
  Undo2,
} from "lucide-react";

type Activity = "doodle" | "mandala" | "color" | "gratitude";

interface Region {
  id: string;
  path?: string;
  type?: "circle";
  cx?: number;
  cy?: number;
  r?: number;
  fill?: string;
}

interface MandalaDesign {
  name: string;
  description: string;
  regions: Region[];
  decoration: ReactNode;
}

interface HistoryState {
  [key: string]: string;
}

const palettes = [
  {
    name: "Peaceful Lotus",
    colors: ["#E8B4B8", "#D8A7B1", "#B8C9B9", "#C8B6D8", "#E5D4A1", "#AFC8D8"],
  },
  {
    name: "Sunset Calm",
    colors: ["#F4B183", "#E5989B", "#CDB4DB", "#A2D2FF", "#F6D6A8", "#BDE0FE"],
  },
  {
    name: "Earth & Bloom",
    colors: ["#C97C5D", "#A7B18A", "#D8C3A5", "#B56576", "#8FA6A0", "#E6CCB2"],
  },
  {
    name: "Royal Rangoli",
    colors: ["#D88C9A", "#8E7DBE", "#6FA3A8", "#E0A458", "#B7A57A", "#A9C5A0"],
  },
];

const colorOptions = [
  "#E8B4B8",
  "#D8A7B1",
  "#F4B183",
  "#E5D4A1",
  "#B8C9B9",
  "#AFC8D8",
  "#C8B6D8",
  "#C97C5D",
  "#A7B18A",
  "#8E7DBE",
  "#6FA3A8",
  "#B56576",
];

const therapyColors = [
  {
    name: "Soft Blue",
    color: "#BFD7EA",
    message:
      "Take a slow breath and imagine yourself somewhere peaceful and spacious.",
  },
  {
    name: "Gentle Green",
    color: "#C8D5B9",
    message:
      "Let your shoulders relax. Focus on the feeling of freshness and balance.",
  },
  {
    name: "Warm Peach",
    color: "#F4C7AB",
    message:
      "Give yourself permission to pause. You do not have to solve everything right now.",
  },
  {
    name: "Lavender",
    color: "#D8C4E8",
    message:
      "Slow down for a moment and bring your attention back to the present.",
  },
  {
    name: "Soft Rose",
    color: "#E8B4B8",
    message:
      "Be gentle with yourself. A short peaceful break can help reset your mind.",
  },
  {
    name: "Warm Yellow",
    color: "#F3DFA2",
    message:
      "Notice something small that makes you feel hopeful, comfortable, or grateful.",
  },
];

const polar = (cx: number, cy: number, radius: number, angle: number) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
};

const petalPath = (
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) => {
  const a = polar(cx, cy, innerRadius, startAngle);
  const b = polar(cx, cy, outerRadius, startAngle + (endAngle - startAngle) * 0.35);
  const c = polar(cx, cy, outerRadius, endAngle - (endAngle - startAngle) * 0.35);
  const d = polar(cx, cy, innerRadius, endAngle);

  const midAngle = (startAngle + endAngle) / 2;
  const tip = polar(cx, cy, outerRadius * 1.08, midAngle);

  return `
    M ${a.x} ${a.y}
    Q ${b.x} ${b.y} ${tip.x} ${tip.y}
    Q ${c.x} ${c.y} ${d.x} ${d.y}
    A ${innerRadius} ${innerRadius} 0 0 1 ${a.x} ${a.y}
    Z
  `;
};

const ringSegmentPath = (
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) => {
  const outerStart = polar(cx, cy, outerRadius, startAngle);
  const outerEnd = polar(cx, cy, outerRadius, endAngle);
  const innerEnd = polar(cx, cy, innerRadius, endAngle);
  const innerStart = polar(cx, cy, innerRadius, startAngle);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `
    M ${outerStart.x} ${outerStart.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
    L ${innerEnd.x} ${innerEnd.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}
    Z
  `;
};

const diamondPath = (
  cx: number,
  cy: number,
  radius: number,
  angle: number
) => {
  const p1 = polar(cx, cy, radius, angle);
  const p2 = polar(cx, cy, radius * 0.48, angle + 55);
  const p3 = polar(cx, cy, radius * 0.72, angle + 180);
  const p4 = polar(cx, cy, radius * 0.48, angle - 55);

  return `
    M ${p1.x} ${p1.y}
    Q ${p2.x} ${p2.y} ${p3.x} ${p3.y}
    Q ${p4.x} ${p4.y} ${p1.x} ${p1.y}
    Z
  `;
};

const diyaPath = (
  cx: number,
  cy: number,
  radius: number,
  angle: number
) => {
  const center = polar(cx, cy, radius * 0.58, angle);
  const left = polar(cx, cy, radius * 0.28, angle - 55);
  const right = polar(cx, cy, radius * 0.28, angle + 55);
  const tip = polar(cx, cy, radius * 0.98, angle);

  return `
    M ${left.x} ${left.y}
    Q ${center.x} ${center.y + radius * 0.23} ${right.x} ${right.y}
    Q ${tip.x} ${tip.y} ${center.x} ${center.y - radius * 0.12}
    Q ${center.x - radius * 0.2} ${center.y - radius * 0.18} ${left.x} ${left.y}
    Z
  `;
};

const createLotusRangoli = (): MandalaDesign => {
  const regions: Region[] = [];

  regions.push({
    id: "center",
    type: "circle",
    cx: 350,
    cy: 350,
    r: 48,
  });

  for (let i = 0; i < 8; i++) {
    const start = i * 45 - 22;
    regions.push({
      id: `inner-petal-${i}`,
      path: petalPath(350, 350, 48, 128, start, start + 44),
    });
  }

  for (let i = 0; i < 8; i++) {
    const start = i * 45 - 20;
    regions.push({
      id: `middle-ring-${i}`,
      path: ringSegmentPath(350, 350, 130, 188, start, start + 40),
    });
  }

  for (let i = 0; i < 8; i++) {
    const start = i * 45 - 20;
    regions.push({
      id: `outer-petal-${i}`,
      path: petalPath(350, 350, 188, 282, start, start + 40),
    });
  }

  for (let i = 0; i < 8; i++) {
    const start = i * 45 - 20;
    regions.push({
      id: `outer-ring-${i}`,
      path: ringSegmentPath(350, 350, 282, 318, start, start + 40),
    });
  }

  return {
    name: "Lotus Rangoli",
    description:
      "A graceful lotus-inspired circular pattern with spacious petals and easy-to-fill sections.",
    regions,
    decoration: (
      <>
        <circle
          cx="350"
          cy="350"
          r="324"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="3"
        />
        <circle
          cx="350"
          cy="350"
          r="116"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
        <circle
          cx="350"
          cy="350"
          r="202"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
      </>
    ),
  };
};

const createFloralRangoli = (): MandalaDesign => {
  const regions: Region[] = [];

  regions.push({
    id: "floral-center",
    type: "circle",
    cx: 350,
    cy: 350,
    r: 55,
  });

  for (let i = 0; i < 10; i++) {
    const start = i * 36 - 18;

    regions.push({
      id: `flower-petal-${i}`,
      path: petalPath(350, 350, 55, 145, start, start + 35),
    });
  }

  for (let i = 0; i < 10; i++) {
    const start = i * 36 - 17;

    regions.push({
      id: `flower-ring-${i}`,
      path: ringSegmentPath(350, 350, 146, 205, start, start + 34),
    });
  }

  for (let i = 0; i < 10; i++) {
    const start = i * 36 - 17;

    regions.push({
      id: `flower-outer-petal-${i}`,
      path: petalPath(350, 350, 205, 302, start, start + 34),
    });
  }

  return {
    name: "Floral Rangoli",
    description:
      "A balanced flower pattern with broad petals that feels decorative without becoming complicated.",
    regions,
    decoration: (
      <>
        <circle
          cx="350"
          cy="350"
          r="322"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="3"
        />
        <circle
          cx="350"
          cy="350"
          r="90"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
      </>
    ),
  };
};

const createDiyaRangoli = (): MandalaDesign => {
  const regions: Region[] = [];

  regions.push({
    id: "diya-center",
    type: "circle",
    cx: 350,
    cy: 350,
    r: 50,
  });

  for (let i = 0; i < 8; i++) {
    const angle = i * 45;

    regions.push({
      id: `diya-${i}`,
      path: diyaPath(350, 350, 125, angle),
    });

    regions.push({
      id: `diya-ring-${i}`,
      path: ringSegmentPath(
        350,
        350,
        142,
        198,
        angle - 17,
        angle + 17
      ),
    });
  }

  for (let i = 0; i < 8; i++) {
    const start = i * 45 - 20;

    regions.push({
      id: `diya-outer-${i}`,
      path: petalPath(350, 350, 200, 300, start, start + 40),
    });
  }

  return {
    name: "Diya Rangoli",
    description:
      "An elegant circular diya arrangement inspired by traditional festive rangoli patterns.",
    regions,
    decoration: (
      <>
        <circle
          cx="350"
          cy="350"
          r="320"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="3"
        />
        <circle
          cx="350"
          cy="350"
          r="105"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
        <circle
          cx="350"
          cy="350"
          r="215"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
      </>
    ),
  };
};

const createPaisleyRangoli = (): MandalaDesign => {
  const regions: Region[] = [];

  regions.push({
    id: "paisley-center",
    type: "circle",
    cx: 350,
    cy: 350,
    r: 46,
  });

  for (let i = 0; i < 8; i++) {
    const angle = i * 45;

    const outer = polar(350, 350, 185, angle);
    const upper = polar(350, 350, 275, angle - 28);
    const lower = polar(350, 350, 275, angle + 28);
    const tip = polar(350, 350, 315, angle);

    regions.push({
      id: `paisley-${i}`,
      path: `
        M ${outer.x} ${outer.y}
        Q ${upper.x} ${upper.y} ${tip.x} ${tip.y}
        Q ${lower.x} ${lower.y} ${outer.x} ${outer.y}
        Z
      `,
    });

    const inner = polar(350, 350, 218, angle);

    regions.push({
      id: `paisley-inner-${i}`,
      path: `
        M ${inner.x} ${inner.y}
        Q ${polar(350, 350, 248, angle - 15).x}
          ${polar(350, 350, 248, angle - 15).y}
        Q ${polar(350, 350, 270, angle).x}
          ${polar(350, 350, 270, angle).y}
        Q ${polar(350, 350, 248, angle + 15).x}
          ${polar(350, 350, 248, angle + 15).y}
        Z
      `,
    });
  }

  for (let i = 0; i < 8; i++) {
    const start = i * 45 - 18;

    regions.push({
      id: `paisley-ring-${i}`,
      path: ringSegmentPath(350, 350, 100, 160, start, start + 36),
    });
  }

  return {
    name: "Paisley Rangoli",
    description:
      "A flowing paisley-inspired circular design with large decorative sections for relaxed coloring.",
    regions,
    decoration: (
      <>
        <circle
          cx="350"
          cy="350"
          r="322"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="3"
        />
        <circle
          cx="350"
          cy="350"
          r="165"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
      </>
    ),
  };
};

const createGeometricRangoli = (): MandalaDesign => {
  const regions: Region[] = [];

  regions.push({
    id: "geo-center",
    type: "circle",
    cx: 350,
    cy: 350,
    r: 58,
  });

  for (let i = 0; i < 8; i++) {
    regions.push({
      id: `geo-diamond-${i}`,
      path: diamondPath(350, 350, 155, i * 45),
    });
  }

  for (let i = 0; i < 8; i++) {
    const start = i * 45 - 19;

    regions.push({
      id: `geo-ring-${i}`,
      path: ringSegmentPath(350, 350, 165, 225, start, start + 38),
    });
  }

  for (let i = 0; i < 8; i++) {
    regions.push({
      id: `geo-outer-diamond-${i}`,
      path: diamondPath(350, 350, 282, i * 45 + 22.5),
    });
  }

  return {
    name: "Geometric Rangoli",
    description:
      "A symmetrical geometric pattern with clean, spacious sections for a focused creative break.",
    regions,
    decoration: (
      <>
        <circle
          cx="350"
          cy="350"
          r="322"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="3"
        />
        <circle
          cx="350"
          cy="350"
          r="108"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
        <circle
          cx="350"
          cy="350"
          r="235"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
      </>
    ),
  };
};

const createSunflowerRangoli = (): MandalaDesign => {
  const regions: Region[] = [];

  regions.push({
    id: "sun-center",
    type: "circle",
    cx: 350,
    cy: 350,
    r: 62,
  });

  for (let i = 0; i < 12; i++) {
    const start = i * 30 - 14;

    regions.push({
      id: `sun-petal-${i}`,
      path: petalPath(350, 350, 62, 178, start, start + 28),
    });
  }

  for (let i = 0; i < 12; i++) {
    const start = i * 30 - 13;

    regions.push({
      id: `sun-ring-${i}`,
      path: ringSegmentPath(350, 350, 180, 225, start, start + 26),
    });
  }

  for (let i = 0; i < 12; i++) {
    const start = i * 30 - 13;

    regions.push({
      id: `sun-outer-${i}`,
      path: petalPath(350, 350, 226, 306, start, start + 26),
    });
  }

  return {
    name: "Sunflower Rangoli",
    description:
      "A bright flower-inspired pattern with repeated broad petals and a calm circular rhythm.",
    regions,
    decoration: (
      <>
        <circle
          cx="350"
          cy="350"
          r="322"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="3"
        />
        <circle
          cx="350"
          cy="350"
          r="105"
          fill="none"
          stroke="#3f3a42"
          strokeWidth="2"
        />
      </>
    ),
  };
};

const designs: MandalaDesign[] = [
  createLotusRangoli(),
  createFloralRangoli(),
  createDiyaRangoli(),
  createPaisleyRangoli(),
  createGeometricRangoli(),
  createSunflowerRangoli(),
];

const CreativeCorner = () => {
  const [activeActivity, setActiveActivity] =
    useState<Activity>("doodle");

  const [doodleColor, setDoodleColor] = useState("#6B5B73");
  const [doodleSize, setDoodleSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  const doodleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const doodleHistoryRef = useRef<ImageData[]>([]);
  const doodleHistoryIndexRef = useRef(-1);

  const [mandalaDesignIndex, setMandalaDesignIndex] = useState(0);
  const [mandalaColors, setMandalaColors] = useState<HistoryState>({});
  const [mandalaHistory, setMandalaHistory] = useState<HistoryState[]>([{}]);
  const [mandalaHistoryIndex, setMandalaHistoryIndex] = useState(0);
  const [selectedMandalaColor, setSelectedMandalaColor] = useState("#E8B4B8");
  const [paletteMode, setPaletteMode] = useState<"guided" | "custom">("guided");
  const [paletteIndex, setPaletteIndex] = useState(0);

  const [selectedTherapyColor, setSelectedTherapyColor] = useState(
    therapyColors[0]
  );
  const [therapyHistory, setTherapyHistory] = useState<string[]>([
    therapyColors[0].color,
  ]);
  const [therapyHistoryIndex, setTherapyHistoryIndex] = useState(0);

  const [gratitudeText, setGratitudeText] = useState("");
  const [gratitudeNotes, setGratitudeNotes] = useState<string[]>([]);
  const [gratitudeHistory, setGratitudeHistory] = useState<string[][]>([[]]);
  const [gratitudeHistoryIndex, setGratitudeHistoryIndex] = useState(0);

  const currentDesign = designs[mandalaDesignIndex];

  useEffect(() => {
    const canvas = doodleCanvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = 900;
    canvas.height = 500;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.lineCap = "round";
    context.lineJoin = "round";

    doodleHistoryRef.current = [context.getImageData(0, 0, canvas.width, canvas.height)];
    doodleHistoryIndexRef.current = 0;
  }, []);

  const getDoodlePosition = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = doodleCanvasRef.current;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in event) {
      clientX = event.touches[0]?.clientX ?? 0;
      clientY = event.touches[0]?.clientY ?? 0;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const saveDoodleSnapshot = () => {
    const canvas = doodleCanvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const image = context.getImageData(0, 0, canvas.width, canvas.height);

    doodleHistoryRef.current = doodleHistoryRef.current.slice(
      0,
      doodleHistoryIndexRef.current + 1
    );

    doodleHistoryRef.current.push(image);
    doodleHistoryIndexRef.current++;
  };

  const startDoodle = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    const canvas = doodleCanvasRef.current;
    const position = getDoodlePosition(event);

    if (!canvas || !position) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.strokeStyle = doodleColor;
    context.lineWidth = doodleSize;
    context.beginPath();
    context.moveTo(position.x, position.y);

    setIsDrawing(true);
  };

  const drawDoodle = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    if (!isDrawing) return;

    const position = getDoodlePosition(event);

    const canvas = doodleCanvasRef.current;

    if (!position || !canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.lineTo(position.x, position.y);
    context.stroke();
  };

  const stopDoodle = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    saveDoodleSnapshot();
  };

  const undoDoodle = () => {
    const canvas = doodleCanvasRef.current;

    if (!canvas || doodleHistoryIndexRef.current <= 0) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    doodleHistoryIndexRef.current--;

    context.putImageData(
      doodleHistoryRef.current[doodleHistoryIndexRef.current],
      0,
      0
    );
  };

  const redoDoodle = () => {
    const canvas = doodleCanvasRef.current;

    if (
      !canvas ||
      doodleHistoryIndexRef.current >= doodleHistoryRef.current.length - 1
    ) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) return;

    doodleHistoryIndexRef.current++;

    context.putImageData(
      doodleHistoryRef.current[doodleHistoryIndexRef.current],
      0,
      0
    );
  };

  const clearDoodle = () => {
    const canvas = doodleCanvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    saveDoodleSnapshot();
  };

  const saveDoodle = () => {
    const canvas = doodleCanvasRef.current;

    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "mindease-doodle.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const pushMandalaHistory = (next: HistoryState) => {
    const updatedHistory = mandalaHistory
      .slice(0, mandalaHistoryIndex + 1)
      .concat([next]);

    setMandalaHistory(updatedHistory);
    setMandalaHistoryIndex(updatedHistory.length - 1);
    setMandalaColors(next);
  };

  const fillMandalaRegion = (regionId: string) => {
    const updated = {
      ...mandalaColors,
      [regionId]: selectedMandalaColor,
    };

    pushMandalaHistory(updated);
  };

  const undoMandala = () => {
    if (mandalaHistoryIndex <= 0) return;

    const nextIndex = mandalaHistoryIndex - 1;
    setMandalaHistoryIndex(nextIndex);
    setMandalaColors(mandalaHistory[nextIndex]);
  };

  const redoMandala = () => {
    if (mandalaHistoryIndex >= mandalaHistory.length - 1) return;

    const nextIndex = mandalaHistoryIndex + 1;
    setMandalaHistoryIndex(nextIndex);
    setMandalaColors(mandalaHistory[nextIndex]);
  };

  const clearMandala = () => {
    pushMandalaHistory({});
  };

  const changeMandalaDesign = () => {
    const nextIndex = (mandalaDesignIndex + 1) % designs.length;

    setMandalaDesignIndex(nextIndex);
    setMandalaColors({});
    setMandalaHistory([{}]);
    setMandalaHistoryIndex(0);
  };

  const recolorMandala = () => {
    const nextPaletteIndex = (paletteIndex + 1) % palettes.length;
    setPaletteIndex(nextPaletteIndex);

    const nextPalette = palettes[nextPaletteIndex].colors;
    const filledIds = Object.keys(mandalaColors);

    if (filledIds.length === 0) {
      setSelectedMandalaColor(nextPalette[0]);
      return;
    }

    const recolored: HistoryState = {};

    filledIds.forEach((id, index) => {
      recolored[id] = nextPalette[index % nextPalette.length];
    });

    pushMandalaHistory(recolored);
    setSelectedMandalaColor(nextPalette[0]);
  };

  const resetMandalaDesign = () => {
    setMandalaColors({});
    setMandalaHistory([{}]);
    setMandalaHistoryIndex(0);
  };

  const saveMandala = () => {
    const svg = document.getElementById(
      "mindease-mandala-svg"
    ) as SVGSVGElement | null;

    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `mindease-${currentDesign.name
      .toLowerCase()
      .replace(/\s+/g, "-")}.svg`;

    link.click();

    URL.revokeObjectURL(url);
  };

  const selectTherapyColor = (item: (typeof therapyColors)[number]) => {
    const currentHistory = therapyHistory.slice(
      0,
      therapyHistoryIndex + 1
    );

    currentHistory.push(item.color);

    setTherapyHistory(currentHistory);
    setTherapyHistoryIndex(currentHistory.length - 1);
    setSelectedTherapyColor(item);
  };

  const undoTherapy = () => {
    if (therapyHistoryIndex <= 0) return;

    const nextIndex = therapyHistoryIndex - 1;
    const nextColor =
      therapyColors.find(
        (item) => item.color === therapyHistory[nextIndex]
      ) ?? therapyColors[0];

    setTherapyHistoryIndex(nextIndex);
    setSelectedTherapyColor(nextColor);
  };

  const redoTherapy = () => {
    if (therapyHistoryIndex >= therapyHistory.length - 1) return;

    const nextIndex = therapyHistoryIndex + 1;
    const nextColor =
      therapyColors.find(
        (item) => item.color === therapyHistory[nextIndex]
      ) ?? therapyColors[0];

    setTherapyHistoryIndex(nextIndex);
    setSelectedTherapyColor(nextColor);
  };

  const clearTherapy = () => {
    const defaultColor = therapyColors[0];

    setSelectedTherapyColor(defaultColor);
    setTherapyHistory([defaultColor.color]);
    setTherapyHistoryIndex(0);
  };

  const saveTherapy = () => {
    const canvas = document.createElement("canvas");

    canvas.width = 1000;
    canvas.height = 700;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.fillStyle = selectedTherapyColor.color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#3f3a42";
    context.font = "bold 42px Arial";
    context.textAlign = "center";
    context.fillText("Color Therapy", 500, 250);

    context.font = "28px Arial";
    context.fillText(selectedTherapyColor.name, 500, 310);

    context.font = "24px Arial";

    const words = selectedTherapyColor.message.split(" ");
    let line = "";
    let y = 390;

    words.forEach((word) => {
      const test = `${line}${word} `;
      if (context.measureText(test).width > 720) {
        context.fillText(line, 500, y);
        line = `${word} `;
        y += 38;
      } else {
        line = test;
      }
    });

    context.fillText(line, 500, y);

    const link = document.createElement("a");
    link.download = "mindease-color-therapy.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const pushGratitudeHistory = (next: string[]) => {
    const updatedHistory = gratitudeHistory
      .slice(0, gratitudeHistoryIndex + 1)
      .concat([next]);

    setGratitudeHistory(updatedHistory);
    setGratitudeHistoryIndex(updatedHistory.length - 1);
    setGratitudeNotes(next);
  };

  const addGratitudeNote = () => {
    const trimmed = gratitudeText.trim();

    if (!trimmed) return;

    pushGratitudeHistory([...gratitudeNotes, trimmed]);
    setGratitudeText("");
  };

  const undoGratitude = () => {
    if (gratitudeHistoryIndex <= 0) return;

    const nextIndex = gratitudeHistoryIndex - 1;

    setGratitudeHistoryIndex(nextIndex);
    setGratitudeNotes(gratitudeHistory[nextIndex]);
  };

  const redoGratitude = () => {
    if (gratitudeHistoryIndex >= gratitudeHistory.length - 1) return;

    const nextIndex = gratitudeHistoryIndex + 1;

    setGratitudeHistoryIndex(nextIndex);
    setGratitudeNotes(gratitudeHistory[nextIndex]);
  };

  const clearGratitude = () => {
    pushGratitudeHistory([]);
    setGratitudeText("");
  };

  const saveGratitude = () => {
    const canvas = document.createElement("canvas");

    canvas.width = 1000;
    canvas.height = 700;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.fillStyle = "#FFF9F1";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#4A4147";
    context.textAlign = "center";
    context.font = "bold 42px Arial";
    context.fillText("My Gratitude Notes", 500, 90);

    context.font = "24px Arial";
    context.textAlign = "left";

    gratitudeNotes.forEach((note, index) => {
      context.fillText(`${index + 1}. ${note}`, 100, 160 + index * 55);
    });

    const link = document.createElement("a");
    link.download = "mindease-gratitude-notes.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const activityButton = (
    id: Activity,
    icon: ReactNode,
    title: string,
    description: string
  ) => (
    <button
      type="button"
      onClick={() => setActiveActivity(id)}
      className={`rounded-2xl border p-4 text-left transition-all ${
        activeActivity === id
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
      }`}
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          {icon}
        </div>
        <span className="font-semibold">{title}</span>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
    </button>
  );

  const ToolButton = ({
    onClick,
    icon,
    label,
    disabled = false,
  }: {
    onClick: () => void;
    icon: ReactNode;
    label: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Creative Wellness Space
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Creative Corner
          </h1>

          <p className="mt-3 max-w-3xl text-muted-foreground">
            Take a refreshing break through drawing, coloring, mindful color
            activities, and gratitude. There is no right or wrong way to
            create here.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {activityButton(
            "doodle",
            <Brush className="h-5 w-5" />,
            "Digital Doodle Pad",
            "Draw freely, sketch patterns, or simply let your hand move."
          )}

          {activityButton(
            "mandala",
            <PaintBucket className="h-5 w-5" />,
            "Mandala & Rangoli Coloring",
            "Color elegant circular patterns with large, comfortable sections."
          )}

          {activityButton(
            "color",
            <Palette className="h-5 w-5" />,
            "Color Therapy",
            "Choose a calming color and use it as a short mindfulness pause."
          )}

          {activityButton(
            "gratitude",
            <Heart className="h-5 w-5" />,
            "Gratitude Notes",
            "Write down small things that made your day a little better."
          )}
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
          {activeActivity === "doodle" && (
            <section className="p-5 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Digital Doodle Pad</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  There is no goal here. Sketch, scribble, draw patterns, or
                  simply make marks until you feel a little more relaxed.
                </p>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                  <span>Color</span>
                  <input
                    type="color"
                    value={doodleColor}
                    onChange={(event) => setDoodleColor(event.target.value)}
                    className="h-7 w-7 cursor-pointer rounded"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
                  <span>Brush</span>
                  <input
                    type="range"
                    min="2"
                    max="18"
                    value={doodleSize}
                    onChange={(event) =>
                      setDoodleSize(Number(event.target.value))
                    }
                  />
                  <span>{doodleSize}px</span>
                </label>

                <ToolButton
                  onClick={undoDoodle}
                  icon={<Undo2 className="h-4 w-4" />}
                  label="Undo"
                />

                <ToolButton
                  onClick={redoDoodle}
                  icon={<Redo2 className="h-4 w-4" />}
                  label="Redo"
                />

                <ToolButton
                  onClick={clearDoodle}
                  icon={<Eraser className="h-4 w-4" />}
                  label="Clear"
                />

                <ToolButton
                  onClick={saveDoodle}
                  icon={<Save className="h-4 w-4" />}
                  label="Save"
                />
              </div>

              <div className="overflow-hidden rounded-2xl border-2 border-dashed border-border bg-white">
                <canvas
                  ref={doodleCanvasRef}
                  className="block h-auto w-full touch-none"
                  onMouseDown={startDoodle}
                  onMouseMove={drawDoodle}
                  onMouseUp={stopDoodle}
                  onMouseLeave={stopDoodle}
                  onTouchStart={startDoodle}
                  onTouchMove={drawDoodle}
                  onTouchEnd={stopDoodle}
                />
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Let your creativity move without judging the result.
              </p>
            </section>
          )}

          {activeActivity === "mandala" && (
            <section className="p-5 md:p-8">
              <div className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Mandala & Rangoli Coloring
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                      Explore elegant circular rangoli-inspired patterns with
                      spacious sections made for a refreshing coloring break.
                      Follow the suggested palette or create your own
                      combination.
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    {currentDesign.name}
                  </div>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <ToolButton
                  onClick={changeMandalaDesign}
                  icon={<RotateCcw className="h-4 w-4" />}
                  label="Change Design"
                />

                <ToolButton
                  onClick={recolorMandala}
                  icon={<Palette className="h-4 w-4" />}
                  label="Recolor"
                />

                <ToolButton
                  onClick={undoMandala}
                  icon={<Undo2 className="h-4 w-4" />}
                  label="Undo"
                  disabled={mandalaHistoryIndex <= 0}
                />

                <ToolButton
                  onClick={redoMandala}
                  icon={<Redo2 className="h-4 w-4" />}
                  label="Redo"
                  disabled={
                    mandalaHistoryIndex >= mandalaHistory.length - 1
                  }
                />

                <ToolButton
                  onClick={clearMandala}
                  icon={<Eraser className="h-4 w-4" />}
                  label="Clear"
                />

                <ToolButton
                  onClick={resetMandalaDesign}
                  icon={<RotateCcw className="h-4 w-4" />}
                  label="Reset Design"
                />

                <ToolButton
                  onClick={saveMandala}
                  icon={<Download className="h-4 w-4" />}
                  label="Save"
                />
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="flex items-center justify-center rounded-3xl border bg-[#fcfaf7] p-3 md:p-8">
                  <div className="w-full max-w-[700px]">
                    <svg
                      id="mindease-mandala-svg"
                      viewBox="0 0 700 700"
                      className="h-auto w-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0"
                        y="0"
                        width="700"
                        height="700"
                        fill="#fcfaf7"
                      />

                      {currentDesign.regions.map((region) => {
                        const fill =
                          mandalaColors[region.id] ?? "#ffffff";

                        if (region.type === "circle") {
                          return (
                            <circle
                              key={region.id}
                              cx={region.cx}
                              cy={region.cy}
                              r={region.r}
                              fill={fill}
                              stroke="#3f3a42"
                              strokeWidth="3"
                              className="cursor-pointer transition-opacity hover:opacity-80"
                              onClick={() => fillMandalaRegion(region.id)}
                            />
                          );
                        }

                        return (
                          <path
                            key={region.id}
                            d={region.path}
                            fill={fill}
                            stroke="#3f3a42"
                            strokeWidth="3"
                            strokeLinejoin="round"
                            className="cursor-pointer transition-opacity hover:opacity-80"
                            onClick={() => fillMandalaRegion(region.id)}
                          />
                        );
                      })}

                      {currentDesign.decoration}
                    </svg>
                  </div>
                </div>

                <aside className="rounded-2xl border bg-muted/20 p-5">
                  <div className="mb-5">
                    <h3 className="font-semibold">Choose Your Colors</h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Click a color and then click any section of the rangoli
                      to fill it.
                    </p>
                  </div>

                  <div className="mb-5 flex rounded-xl border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setPaletteMode("guided")}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                        paletteMode === "guided"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      Guided Colors
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaletteMode("custom")}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                        paletteMode === "custom"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      My Own Colors
                    </button>
                  </div>

                  {paletteMode === "guided" ? (
                    <div>
                      <p className="mb-3 text-xs font-medium">
                        {palettes[paletteIndex].name}
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        {palettes[paletteIndex].colors.map((color) => (
                          <button
                            type="button"
                            key={color}
                            onClick={() => setSelectedMandalaColor(color)}
                            title={color}
                            className={`relative h-12 rounded-xl border-2 transition ${
                              selectedMandalaColor === color
                                ? "scale-105 border-foreground"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {selectedMandalaColor === color && (
                              <Check className="absolute inset-0 m-auto h-5 w-5 text-foreground" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 gap-3">
                        {colorOptions.map((color) => (
                          <button
                            type="button"
                            key={color}
                            onClick={() => setSelectedMandalaColor(color)}
                            title={color}
                            className={`relative h-12 rounded-xl border-2 transition ${
                              selectedMandalaColor === color
                                ? "scale-105 border-foreground"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {selectedMandalaColor === color && (
                              <Check className="absolute inset-0 m-auto h-5 w-5 text-foreground" />
                            )}
                          </button>
                        ))}
                      </div>

                      <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border bg-background px-3 py-3 text-sm">
                        <span>Custom color</span>
                        <input
                          type="color"
                          value={selectedMandalaColor}
                          onChange={(event) =>
                            setSelectedMandalaColor(event.target.value)
                          }
                          className="h-8 w-8 cursor-pointer"
                        />
                      </label>
                    </div>
                  )}

                  <div className="mt-6 rounded-2xl border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                      <div>
                        <p className="text-sm font-medium">
                          How to use it
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Choose a color, then click a section. Try repeating
                          colors, creating symmetry, or simply choosing colors
                          that feel pleasant to you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
                    The goal is the calming creative process, not making a
                    perfect picture.
                  </p>
                </aside>
              </div>
            </section>
          )}

          {activeActivity === "color" && (
            <section className="p-5 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Color Therapy</h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Choose a color that feels comfortable to you and take a
                  short mindful pause. This activity is intended for
                  relaxation and self-reflection, not as a medical treatment.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                <div
                  className="flex min-h-[430px] items-center justify-center rounded-3xl p-8 text-center transition-all"
                  style={{
                    backgroundColor: selectedTherapyColor.color,
                  }}
                >
                  <div className="max-w-xl">
                    <Sparkles className="mx-auto mb-5 h-10 w-10 text-[#4A4147]" />

                    <h3 className="text-3xl font-bold text-[#4A4147]">
                      {selectedTherapyColor.name}
                    </h3>

                    <p className="mt-6 text-lg leading-8 text-[#4A4147]">
                      {selectedTherapyColor.message}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-muted/20 p-5">
                  <h3 className="font-semibold">Choose a Color</h3>

                  <div className="mt-5 space-y-3">
                    {therapyColors.map((item) => (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => selectTherapyColor(item)}
                        className={`flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left transition hover:scale-[1.01] ${
                          selectedTherapyColor.name === item.name
                            ? "border-foreground shadow-sm"
                            : ""
                        }`}
                      >
                        <span
                          className="h-10 w-10 rounded-full border"
                          style={{ backgroundColor: item.color }}
                        />

                        <span className="flex-1 text-sm font-medium">
                          {item.name}
                        </span>

                        {selectedTherapyColor.name === item.name && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <ToolButton
                      onClick={undoTherapy}
                      icon={<Undo2 className="h-4 w-4" />}
                      label="Undo"
                      disabled={therapyHistoryIndex <= 0}
                    />

                    <ToolButton
                      onClick={redoTherapy}
                      icon={<Redo2 className="h-4 w-4" />}
                      label="Redo"
                      disabled={
                        therapyHistoryIndex >= therapyHistory.length - 1
                      }
                    />

                    <ToolButton
                      onClick={clearTherapy}
                      icon={<Eraser className="h-4 w-4" />}
                      label="Clear"
                    />

                    <ToolButton
                      onClick={saveTherapy}
                      icon={<Save className="h-4 w-4" />}
                      label="Save"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeActivity === "gratitude" && (
            <section className="p-5 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Gratitude Notes</h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Write down small things that brought comfort, happiness,
                  progress, or meaning to your day.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                <div>
                  <textarea
                    value={gratitudeText}
                    onChange={(event) => setGratitudeText(event.target.value)}
                    placeholder="Today I am grateful for..."
                    className="min-h-[260px] w-full resize-none rounded-2xl border bg-background p-5 text-sm outline-none transition focus:border-primary"
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ToolButton
                      onClick={addGratitudeNote}
                      icon={<Heart className="h-4 w-4" />}
                      label="Add Note"
                    />

                    <ToolButton
                      onClick={undoGratitude}
                      icon={<Undo2 className="h-4 w-4" />}
                      label="Undo"
                      disabled={gratitudeHistoryIndex <= 0}
                    />

                    <ToolButton
                      onClick={redoGratitude}
                      icon={<Redo2 className="h-4 w-4" />}
                      label="Redo"
                      disabled={
                        gratitudeHistoryIndex >=
                        gratitudeHistory.length - 1
                      }
                    />

                    <ToolButton
                      onClick={clearGratitude}
                      icon={<Eraser className="h-4 w-4" />}
                      label="Clear"
                    />

                    <ToolButton
                      onClick={saveGratitude}
                      icon={<Save className="h-4 w-4" />}
                      label="Save"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border bg-[#FFF9F1] p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-white p-2 shadow-sm">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#4A4147]">
                        My Gratitude List
                      </h3>

                      <p className="text-xs text-[#6B6268]">
                        Small moments count too.
                      </p>
                    </div>
                  </div>

                  {gratitudeNotes.length === 0 ? (
                    <div className="flex min-h-[230px] items-center justify-center text-center">
                      <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                        Your gratitude notes will appear here after you add
                        them.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {gratitudeNotes.map((note, index) => (
                        <div
                          key={`${note}-${index}`}
                          className="rounded-xl border bg-white p-4 text-sm leading-6 text-[#4A4147]"
                        >
                          <span className="mr-2 font-semibold">
                            {index + 1}.
                          </span>
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <h3 className="font-semibold">A gentle reminder</h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Creative Corner is a wellness and relaxation space. Creative
                activities can be used as a refreshing break, but they are not
                a substitute for professional mental health care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeCorner;
