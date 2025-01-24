import { Card } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@apollo/client";
import { GET_USER_ID } from "@/utils/queries";

interface OTS_CardProps {
  date: string;
  shift: string;
  creatorId: string;
}

const handleButtonClick = () => {
  console.log("Submitted");
};

const OTS_Card = (props: OTS_CardProps) => {
  const {
    loading,
    error,
    data: userData,
  } = useQuery(GET_USER_ID, {
    variables: { userId: props.creatorId },
  });
  console.log("userData:", userData);

  return (
    <Card.Root
      width="320px"
      variant="outline"
      css={{
        "&": {
          backgroundColor: "white",
          borderWidth: "1px",
          borderColor: "gray.200",
        },
      }}
    >
      <Card.Body gap="2">
        <Card.Title mt="2">{props.date}</Card.Title>
        <Card.Description>
          {error ? (
            <>Error: {error.message}</>
          ) : loading ? (
            <>Loading...</>
          ) : (
            <>
              Shift {props.shift} <br />
              Created by: {userData ? userData.getUserById.username : "Unknown"}
            </>
          )}
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button onClick={handleButtonClick}>View</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default OTS_Card;
