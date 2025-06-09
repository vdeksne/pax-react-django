import Sidebar from "./Sidebar";
import UseProfileData from "../plugin/UseProfileData";
import "../../assets/css/account.css";

function Account() {
  const userProfile = UseProfileData();

  return (
    <div>
      <main className="mt-5" style={{ marginBottom: "170px" }}>
        <div className="container">
          <section className="">
            <div className="row">
              <Sidebar />
              <div className="col-lg-9 mt-1">
                <main className="mb-5" style={{}}>
                  {/* Container for demo purpose */}
                  <div className="container px-4">
                    {/* Section: Summary */}
                    <section className=""></section>
                    {/* Section: Summary */}
                    {/* Section: MSC */}
                    <section className="">
                      <div className="row rounded shadow p-3 text-start">
                        <h2>Hello {userProfile?.full_name}, </h2>
                        <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                          From your account dashboard. you can easily check
                          &amp; view your{" "}
                          <a href="" style={{ textDecoration: "underline" }}>
                            orders
                          </a>
                          , manage your{" "}
                          <a href="" style={{ textDecoration: "underline" }}>
                            shipping address
                          </a>
                          ,{" "}
                          <a href="" style={{ textDecoration: "underline" }}>
                            change password
                          </a>{" "}
                          and{" "}
                          <a href="" style={{ textDecoration: "underline" }}>
                            edit account
                          </a>{" "}
                          infomations.
                        </div>
                      </div>
                    </section>
                    {/* Section: MSC */}
                  </div>
                  {/* Container for demo purpose */}
                </main>
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </div>
  );
}

export default Account;
