import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "../components/NotFound";
import { baseUrl } from "../shared";

export default function Customer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState();
  const [tempCustomer, setTempCustomer] = useState();
  const [notFound, setNotFound] = useState();
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    console.log("customer", customer);
    console.log("tempCustomer", tempCustomer);
    console.log(changed);
  });

  useEffect(() => {
    const url = baseUrl + "/api/customers/" + id;
    fetch(url)
      .then((response) => {
        if (response.status === 404) {
          //render a 404 component in this page
          setNotFound(true);
        }
        return response.json();
      })
      .then((data) => {
        setCustomer(data.customer);
        setTempCustomer(data.customer);
      });
  }, []);

  return (
    <>
      {notFound ? <p>The customer with id {id} was not found.</p> : null}

      {customer ? (
        <div>
          <input
            className="m-2 block px-2"
            type="text"
            value={tempCustomer.name}
            onChange={(e) => {
              setChanged(true);
              setTempCustomer({ ...tempCustomer, name: e.target.value });
            }}
          />
          <input
            className="m-2 block px-2"
            type="text"
            value={tempCustomer.industry}
            onChange={(e) => {
              setChanged(true);
              setTempCustomer({ ...tempCustomer, industry: e.target.value });
            }}
          />
          {changed ? (
            <>
              <button
                onClick={(e) => {
                  setTempCustomer({ ...customer });
                  setChanged(false)
                }}
              >
                Cancel
              </button>{" "}
              <button>Save</button>
            </>
          ) : null}
        </div>
      ) : null}
      <button
        onClick={(e) => {
          const url = baseUrl + "api/customers/" + id;
          fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Something went wrong");
              }
              navigate("/customers");
            })
            .catch((e) => {
              console.log(e);
            });
        }}
      >
        Delete
      </button>
      <br />
      <Link to="customers">Go Back</Link>
    </>
  );
}
