"use client";

// import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";

export default function FrameGenerator() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);


  const overlayImgRef = useRef<HTMLImageElement | null>(null);

  const renderOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const overlayImg = new Image();
    overlayImg.src = "/assets/BLOCKFUSE LABS 2026birthdaypng.png";

    overlayImg.onload = () => {
      // Draw the birthday template on top
      ctx.drawImage(
        overlayImg,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.save();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let nameFontSize = 28;

      if (name.length > 18) {
        nameFontSize = 24;
      }

      if (name.length > 25) {
        nameFontSize = 21;
      }

      ctx.font = `bold ${nameFontSize}px Arial, Helvetica, sans-serif`;

      ctx.fillText(
        name.toUpperCase() || "YOUR NAME",
        770,
        787
      );

      ctx.restore();

      ctx.save();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 27px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(
        birthday.toUpperCase() || "YOUR BIRTHDATE",
        390,
        900
      );

      ctx.restore();
    };
  }, [name, birthday]);
  const userImgRef = useRef<HTMLImageElement | null>(null);

  const draw = useCallback(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = 1080;

  canvas.width = size;
  canvas.height = size;

  // Clean canvas
  ctx.clearRect(0, 0, size, size);

  if (image) {
    const userImg = new Image();
    userImg.src = image;

    userImg.onload = () => {

      const photoX = 614;
      const photoY = 432;
      const photoWidth = 312;
      const photoHeight = 317;

      const imageWidth = userImg.naturalWidth;
      const imageHeight = userImg.naturalHeight;

      const imageRatio = imageWidth / imageHeight;
      const boxRatio = photoWidth / photoHeight;

      let drawWidth: number;
      let drawHeight: number;

      if (imageRatio > boxRatio) {
        drawHeight = photoHeight * scale;
        drawWidth = drawHeight * imageRatio;
      } else {
        drawWidth = photoWidth * scale;
        drawHeight = drawWidth / imageRatio;
      }

      const drawX =
        photoX +
        (photoWidth - drawWidth) / 2 +
        offsetX;

      const drawY =
        photoY +
        (photoHeight - drawHeight) / 2 +
        offsetY;

      ctx.save();

      ctx.beginPath();
      ctx.rect(
        photoX,
        photoY,
        photoWidth,
        photoHeight
      );

      ctx.clip();

      ctx.drawImage(
        userImg,
        drawX,
        drawY,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      renderOverlay();
    };
  } else {
    renderOverlay();
  }
}, [
  image,
  scale,
  offsetX,
  offsetY,
  renderOverlay
]);

  useEffect(() => {
    if (image) {
      userImgRef.current = null;
    }
  }, [image]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = "blockfuse-birthday-frame.png";
    link.href = canvasRef.current?.toDataURL() || "";
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F9FBFD] text-slate-900 font-sans flex flex-col">
      <header className="w-full py-6 md:px-80 px-6 flex items-center justify-start bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.webp" alt="Logo" className="h-12 w-12 rounded-full object-contain shadow-sm" />
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">BLOCKFUSE</span>
              <span className="text-lg font-light tracking-tight text-slate-500 uppercase">Frames</span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">BLOCKFUSE BIRTHDAY</span>
          </div >
        </div >
      </header>

      <div className="flex-1 flex flex-col items-center py-16 px-4">
        <div className="text-center max-w-2xl mb-16">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight text-[#052F54]">
            Create your <span
              className="font-black tracking-tighter"
              style={{
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                color: '#f8fafc',
                WebkitTextStroke: '1.5px #0b3154',
                textStroke: '1.5px #0b3154',
              }}
            >
              Blockfuse Birthday
            </span> frame in seconds!
          </h1>
          <p className="text-slate-500 text-lg">
            Join the elite circle of builders. Add your favorite photo and your details to create a professional beautiful BlockFuse birthday card to share with family, friends and community.
          </p>
        </div>

        <div className="max-w-7xl w-full grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
          <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-100">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Your Details</h2>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Your Photo *</label>
                <div className="flex items-center gap-4">
                  <input type="file" id="file-upload" className="hidden" onChange={handleImageUpload} />
                  {!image ? (
                    <label
                      htmlFor="file-upload"
                      className="flex-1 cursor-pointer bg-white border-2 border-dashed border-slate-300 p-12 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-cyan-400 transition-all group"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <svg
                          className="w-16 h-16 text-slate-400 group-hover:text-cyan-500 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-4.5-4.5H3m18 0h-3a4.5 4.5 0 00-4.5 4.5v0a4.5 4.5 0 01-4.5-4.5" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V21m0 0h3m-3 0H9" />
                        </svg>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                            Upload Photo
                          </span>
                          <span className="text-sm text-slate-500">High res JPG or PNG</span>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="flex-1 bg-slate-50 border border-slate-200 p-6 rounded-3xl flex flex-col gap-6 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-lg font-bold text-slate-900">Photo Uploaded</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setScale(1);
                              setOffsetX(0);
                              setOffsetY(0);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full transition-colors uppercase tracking-wider"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setImage(null)}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-full transition-colors uppercase tracking-wider"
                          >
                            Replace
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Zoom & Scale</label>
                            <span className="text-sm font-mono font-bold text-slate-600">{Math.round(scale * 100)}%</span>
                          </div>
                          <input
                            type="range" min="0.1" max="3" step="0.01"
                            value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Move X</label>
                              <span className="text-xs font-mono text-slate-500">{offsetX}px</span>
                            </div>
                            <input
                              type="range" min="-500" max="500" step="1"
                              value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Move Y</label>
                              <span className="text-xs font-mono text-slate-500">{offsetY}px</span>
                            </div>
                            <input
                              type="range" min="-500" max="500" step="1"
                              value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Birthday *</label>
                <input
                  type="text"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="e.g. December 7"
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              onClick={download}
              className="w-full mt-12 bg-[#ca92f8] text-white font-bold py-5 rounded-2xl hover:bg-[#775c7e] transition-all flex items-center justify-center gap-3 text-lg shadow-xl active:scale-95"
            >
              <span className="flex items-center gap-4">
                <img src="/assets/logo.webp" className="h-9" alt="logo" /> Generate My Blockfuse Frame
              </span>
            </button>
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative p-8 bg-white rounded-[50px] shadow-2xl border border-slate-100 ring-1 ring-slate-200">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-slate-200 px-4 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                Live Preview
              </div>
              <canvas
                ref={canvasRef}
                className="w-[600px] h-[600px] rounded-xl shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto w-full py-6 bg-[#052F54] text-center text-slate-400 text-sm border-t border-slate-800">
        © 2026 Built by <span className="font-bold text-white">Blockfuse Labs</span>
      </footer>
    </div>
  );
}
