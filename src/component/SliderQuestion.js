export default function SliderQuestion({ label, field, min = 30, max = 180, step = 15, value, onChange,sliderClassName  }) { 
    return (<>
        <div className="py-2">
            <div className="mb-2">
                <label htmlFor={field} className="h5 py-2 form-label">{label}</label>
                <input type="range" //HTML5 的滑動條元件                    
                    id={field}
                    min={min}
                    max={max}
                    step={step}//每次滑動的增量（預設 15）
                    value={value}//當前滑桿的位置（由父層狀態控制）
                    onChange={(e) => onChange(field, Number(e.target.value))}//當滑動時，呼叫 onChange(field, value)，通知父層更新狀態
                    className={`form-range slider ${sliderClassName}`}  />
            </div>
            <div className="text-end me-2">{value} 分鐘</div>
        </div >
    </>)
}