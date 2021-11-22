
export default function Spinner(wrapperClasses, spinnerClasses, textClasses, text="Loading...") {
    return (<div className={wrapperClasses}>
                <div className={spinnerClasses}></div>
                <div className={textClasses}>{text}</div>
            </div>);
}