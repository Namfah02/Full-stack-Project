import { Nav } from "../../common/NavBar";
import { Header } from "../../common/Header";
import { Footer } from "../../common/Footer";
import logo from "../../common/img/high-street-gym-logo.jpg";
import { XMLUploader } from "./XMLUploader";
import { useAuthentication } from "../authentication";
import { useNavigate } from "react-router-dom";

function ImportPage() {
  const [user] = useAuthentication();
  const navigate = useNavigate();

  return (
    <main className=" bg-gradient-to-r from-gray-200 ">
      <Header />
      <Nav />
      <div className="min-h-screen p-4 flex flex-col items-center justify-center ">
        <img className="w-48 h-auto rounded-full " src={logo} alt="logo" />
        <h2 className="text-red-500 text-xl font-bold m-4">XML File Import</h2>
        <div>
          <button
            onClick={() => navigate("/importlists")}
            className="btn btn-outline btn-error btn-sm mt-2"
          >
            Import lists
          </button>
        </div>
        <div className="flex flex-col my-12 lg:flex-row ">
          <div className="lg:mx-24">
            <span className="label-text text-xl font-semibold ml-5">
              Import user member
            </span>
            <XMLUploader uploadUrl={"/users/upload-xml"} />
          </div>
          <div className="lg:mx-24">
            <span className="label-text text-xl font-semibold ml-5">
              Import class timetable
            </span>
            <XMLUploader uploadUrl={"/classes/upload-xml"} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default ImportPage;
