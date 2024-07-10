import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="container justify-conten-center text-white">
        <h2>Sorry,</h2>
        <h2>you're looking in the wrong place....</h2>
        <Link to={"/"}>Return to the Homepage</Link>
        </div>
    );
}

export default NotFound;