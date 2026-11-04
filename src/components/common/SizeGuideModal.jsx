import React, { useState } from "react";
import { Modal } from "./Modal";
import { useUIStore } from "../../store/uiStore";

export const SizeGuideModal = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useUIStore();
  const [unit, setUnit] = useState("inches"); // inches or cm

  const chartData = [
    { size: "XS", bustIn: "32", waistIn: "26", hipIn: "35", lengthIn: "44", bustCm: "81", waistCm: "66", hipCm: "89", lengthCm: "112" },
    { size: "S", bustIn: "34", waistIn: "28", hipIn: "37", lengthIn: "45", bustCm: "86", waistCm: "71", hipCm: "94", lengthCm: "114" },
    { size: "M", bustIn: "36", waistIn: "30", hipIn: "39", lengthIn: "45", bustCm: "91", waistCm: "76", hipCm: "99", lengthCm: "114" },
    { size: "L", bustIn: "38", waistIn: "32", hipIn: "41", lengthIn: "46", bustCm: "96", waistCm: "81", hipCm: "104", lengthCm: "117" },
    { size: "XL", bustIn: "40", waistIn: "34", hipIn: "43", lengthIn: "46", bustCm: "102", waistCm: "86", hipCm: "109", lengthCm: "117" },
    { size: "XXL", bustIn: "42", waistIn: "36", hipIn: "45", lengthIn: "47", bustCm: "107", waistCm: "91", hipCm: "114", lengthCm: "119" },
  ];

  return (
    <Modal isOpen={isSizeGuideOpen} onClose={closeSizeGuide} title="Size & Fit Guide" maxWidth="max-w-2xl">
      <div className="space-y-6 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-mauve">
            All measurements correspond to garment body measurements. If you are between sizes, we recommend sizing up.
          </p>
          <div className="inline-flex rounded-full bg-primary-light/40 p-1 border border-primary-light">
            <button
              onClick={() => setUnit("inches")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                unit === "inches" ? "bg-white text-primary shadow-sm" : "text-mauve hover:text-plum"
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                unit === "cm" ? "bg-white text-primary shadow-sm" : "text-mauve hover:text-plum"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary-light/30 text-plum font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Bust ({unit === "inches" ? "in" : "cm"})</th>
                <th className="py-3 px-4">Waist ({unit === "inches" ? "in" : "cm"})</th>
                <th className="py-3 px-4">Hip ({unit === "inches" ? "in" : "cm"})</th>
                <th className="py-3 px-4">Kurti Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chartData.map((row) => (
                <tr key={row.size} className="hover:bg-ivory/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-primary">{row.size}</td>
                  <td className="py-3 px-4 text-plum font-medium">
                    {unit === "inches" ? row.bustIn : row.bustCm}
                  </td>
                  <td className="py-3 px-4 text-plum font-medium">
                    {unit === "inches" ? row.waistIn : row.waistCm}
                  </td>
                  <td className="py-3 px-4 text-plum font-medium">
                    {unit === "inches" ? row.hipIn : row.hipCm}
                  </td>
                  <td className="py-3 px-4 text-plum font-medium">
                    {unit === "inches" ? row.lengthIn : row.lengthCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring tips */}
        <div className="bg-ivory rounded-2xl p-4 border border-primary-light/40 space-y-2">
          <h4 className="font-heading font-semibold text-plum">How to Measure</h4>
          <ul className="text-xs text-mauve space-y-1.5 list-disc pl-4">
            <li><strong>Bust:</strong> Measure around the fullest part of your bust while keeping the tape parallel to the floor.</li>
            <li><strong>Waist:</strong> Measure around the natural crease of your waist, slightly above your belly button.</li>
            <li><strong>Hip:</strong> Stand with feet together and measure around the fullest part of your hips and rear.</li>
            <li><strong>Sarees:</strong> Sarees are standard 5.5 meters length with an additional 0.8 meter unstitched blouse piece.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

