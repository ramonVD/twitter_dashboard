//Need to add props when implementing login, the way its setup now doesnt make sense in next
export default function loginBar(options={}) {
    return (
        <header className="flex justify-end w-full sm:h-10 h-8 items-center">
            <div className="order-last px-4">
                <p>{"Login here"}</p>
            </div>
        </header>
    );
}