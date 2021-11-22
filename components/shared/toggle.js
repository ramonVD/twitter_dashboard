export default function Toggle(value, setValue, text="") {
    return (
        <label htmlFor="toggleB" className="flex items-center cursor-pointer">
			<div className="relative my-2">
				<input type="checkbox" id="toggleB" className="sr-only" checked={!value}
				onChange={() => {setValue(!value);}} />
				<div className="block bg-blue-200 w-14 h-8 rounded-full"></div>
				<div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
			</div>
				<div className="ml-3 text-gray-700 font-medium">{text}</div>
		</label>);
}