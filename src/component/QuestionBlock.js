import React from "react";
//需要在 JSX 中回傳多個相鄰元素但不想產生額外的 HTML 標籤時，就使用 React.Fragment。

export default function QuestionBlock({ label, field, options, answers, setAnswers, displayMap }) {
    return (
        <div className="question mb-4 ">
            <p className="p-1 mb-0 text-center bg-secondary text-white">{label}</p>
            <div className="btn-group w-100" role="group" aria-label={`${field}選項`}>
                {options.map((value, index) => {
                    const id = `${field}-${value}`;
                    return (
                        <React.Fragment key={value}>
                            <input
                                type="radio"
                                className="btn-check"//搭配 <label class="btn ..."> 使用，讓 label 看起來像按鈕，但實際上綁定的是 radio。
                                name={field}//決定「這一組」題目的名稱，避免取到一樣互斥
                                id={id}
                                autoComplete="off"//不要自動填入
                                checked={answers[field] === value}//React 的「受控表單控制」語法，表示：如果這一題目前選到的答案（answers[field]）等於這個選項的 value，那就勾選此 radio。
                                onChange={() =>
                                    setAnswers((prev) => ({ ...prev, [field]: value }))
                                }
                            />
                            <label className="btn btn-outline-dark p-2 rounded-0 border-2" htmlFor={id}>
                                {displayMap?.[value] || value}
                            </label>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
