import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../../hooks/fetchData";
import { useStore } from "../../../config/store";
import { Image, Col, Row } from "react-bootstrap";
import { format } from "timeago.js";
import Loader from "../../../utils/Loader";
import { getUserProfile } from "../../../config/api";
import { Update } from "../../../components";

export default function Profile() {
  const { currentUser } = useStore();
  const { username } = useParams();
  const {
    data: profile,
    error,
    loading,
  } = useFetchData(getUserProfile, username, currentUser?.access_token);


  console.log("profile", profile);

  useEffect(() => {
    document.title = `${profile?.username} profile`;
  }, [profile?.username]);

  error && <p className="mt-5 fs-5">{error.message}</p>;

  return (
    <div>
      {loading && <Loader />}
      <Row className="align-items-center justify-content-around gy-2">
        <Col md={12} className="text-center mb-4">
          <Image
            src={profile?.profileImg}
            className="rounded-circle object-fit-cover mb-4 shadow"
            style={{ width: "100px", height: "100px" }}
          />
          <h1 className="fs-5 fw-bold">{profile.username}</h1>
          <p className="fs-5 mb-1">{profile?.email}</p>
          <p className="fs-5">Date Registered: {format(profile.createdAt)}</p>
        </Col>
        <Col md={6} lg={5}>
        <Update/>
        </Col>
      </Row>
    </div>
  );
}
