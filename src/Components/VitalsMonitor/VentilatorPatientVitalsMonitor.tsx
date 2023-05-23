import { useEffect } from "react";
import { PatientAssetBed } from "../Assets/AssetTypes";
import { Link } from "raviger";
import { GENDER_TYPES } from "../../Common/constants";
import CareIcon from "../../CAREUI/icons/CareIcon";
import useVentilatorVitalsMonitor from "./useVentilatorVitalsMonitor";
import { VitalsValueBase } from "./types";
import { classNames } from "../../Utils/utils";

interface Props {
  patientAssetBed?: PatientAssetBed;
  socketUrl: string;
  size?: { width: number; height: number };
}

export default function VentilatorPatientVitalsMonitor({
  patientAssetBed,
  socketUrl,
  size,
}: Props) {
  const { connect, waveformCanvas, data } = useVentilatorVitalsMonitor();
  const { patient, bed } = patientAssetBed ?? {};

  useEffect(() => {
    connect(socketUrl);
  }, [socketUrl]);

  return (
    <div className="flex flex-col gap-1 bg-[#020617] p-2 rounded">
      {patientAssetBed && (
        <div className="flex items-center justify-between px-2 tracking-wide">
          <div className="flex items-center gap-2">
            {patient ? (
              <Link
                href={`/facility/${patient.last_consultation?.facility}/patient/${patient.id}/consultation/${patient.last_consultation?.id}`}
                className="font-bold uppercase text-white"
              >
                {patient?.name}
              </Link>
            ) : (
              <span className="flex gap-1 items-center text-gray-500">
                <CareIcon className="care-l-ban" />
                No Patient
              </span>
            )}
            {patient && (
              <span className="text-gray-400 font-bold text-sm">
                {patient.age}y;{" "}
                {GENDER_TYPES.find((g) => g.id === patient.gender)?.icon}
              </span>
            )}
          </div>
          {bed && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CareIcon className="care-l-bed text-base" />
                {bed.name}
              </span>
              <span className="flex items-center gap-1">
                <CareIcon className="care-l-location-point text-base" />
                {bed.location_object?.name}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:justify-between divide-y divide-x-0 md:divide-y-0 md:divide-x divide-blue-600 gap-2">
        <div className="relative" style={{ ...(size ?? waveformCanvas.size) }}>
          <canvas
            className="absolute top-0 left-0"
            ref={waveformCanvas.background.canvasRef}
            style={{ ...(size ?? waveformCanvas.size) }}
            {...waveformCanvas.size}
          />
          <canvas
            className="absolute top-0 left-0"
            ref={waveformCanvas.foreground.canvasRef}
            style={{ ...(size ?? waveformCanvas.size) }}
            {...waveformCanvas.size}
          />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-1 md:divide-y divide-blue-600 text-white tracking-wider">
          <NonWaveformData
            label="PEEP"
            attr={data.peep}
            className="text-orange-500"
          />
          <NonWaveformData
            label="R. Rate"
            attr={data.respRate}
            className="text-sky-300"
          />
          <NonWaveformData
            label="Insp-Time"
            attr={data.inspTime}
            className="text-fuchsia-400"
          />
          <NonWaveformData
            label="FiO2"
            attr={data.fio2}
            className="text-yellow-300"
          />
        </div>
      </div>
    </div>
  );
}

interface NonWaveformDataProps {
  label: string;
  attr?: VitalsValueBase;
  className?: string;
}

const NonWaveformData = ({ label, attr, className }: NonWaveformDataProps) => {
  return (
    <div
      className={classNames("flex justify-between items-center p-1", className)}
    >
      <div className="flex gap-2 items-start h-full font-bold">
        <span className="text-sm">{label}</span>
        <span className="text-xs">{attr?.unit ?? "--"}</span>
      </div>
      <span className="text-4xl md:text-6xl font-black mr-3">
        {attr?.value ?? "--"}
      </span>
    </div>
  );
};
