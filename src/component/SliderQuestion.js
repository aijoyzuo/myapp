import { useState } from "react"

export default function SliderQuestion({ label, field, min = 30, max = 180, step = 15, value, onChange,sliderClassName  }) { 
    return (<>
        <div className="py-2">
            <div className="mb-2">
                <label htmlFor={field} className="h5 py-2 form-label">{label}</label>
                <input type="range"                    
                    id={field}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(field, Number(e.target.value))}
                    className={`form-range slider ${sliderClassName}`}  />
            </div>
            <div className="text-end me-2">{value} 分鐘</div>
        </div >
    </>)
}