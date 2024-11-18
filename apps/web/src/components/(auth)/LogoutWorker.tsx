import { BiSolidLogOut } from "react-icons/bi";
export default function LogoutWorker () {
    
    function handleLogout() {
        localStorage.removeItem('outletWorker')
        localStorage.removeItem('outletAdmin')
        window.location.reload();
    }

    return (
        <div>
            <button onClick={handleLogout} className="w-fit px-2 py-1 bg-red-800 text-white duration-150 cursor-pointer rounded-full hover:scale-110"> 
            logout</button>
        </div>
    )
}