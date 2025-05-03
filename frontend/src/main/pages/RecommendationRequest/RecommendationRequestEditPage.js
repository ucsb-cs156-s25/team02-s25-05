import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: recommendationrequest,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/recommendationrequest?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/recommendationrequest`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (recommendationrequest) => ({
    url: "/api/recommendationrequest",
    method: "PUT",
    params: {
      id: recommendationrequest.id,
    },
    data: {
      requestorEmail: recommendationrequest.requestorEmail,
      professorEmail: recommendationrequest.professorEmail,
      explanation: recommendationrequest.explanation,
      dateRequested: recommendationrequest.dateRequested,
      dateNeeded: recommendationrequest.dateNeeded,
      done: recommendationrequest.done,
    },
  });

  const onSuccess = (recommendationrequest) => {
    toast(`Recommendation Request Updated - id: ${recommendationrequest.id} requestorEmail: ${recommendationrequest.requestorEmail}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendationrequest?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Recommendation Request</h1>
        {recommendationrequest && (
          <RecommendationRequestForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={recommendationrequest}
          />
        )}
      </div>
    </BasicLayout>
  );
}
