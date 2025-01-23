import { Card } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

interface OTS_CardProps {
  date: string;
  shift: string;
  creator: string;
}

const handleButtonClick = () => {
  console.log("Submitted");
};

const OTS_Card = (props: OTS_CardProps) => {
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
          Shift {props.shift} <br /> Created by: {props.creator}
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button onClick={handleButtonClick}>View</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default OTS_Card;
