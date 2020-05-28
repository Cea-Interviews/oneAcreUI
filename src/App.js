import React, { useState, useEffect } from "react";
import { Flex, Button, Box, Text } from "@chakra-ui/core";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import customTheme from "./theme";
import axios from "axios";

function App() {
  const [fills, setFile] = useState({ selectedFile: null });
  const [resetInfo, setResetInfo] = useState("");
  const [customerState, setCustomerState] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [filter, setFilters] = useState({
    customer: "",
    season: "",
    repaymentID: "",
  });
  const [responses, setResponse] = useState("");
  useEffect(() => {
    const url = "http://localhost:3500/api";
    const getSummaries = async () => {
      const response = await axios.get(`${url}/customers/summary`);
      if (response) {
        setCustomerState(response.data.data);
      } else {
        setCustomerState(response.message);
      }
    };
    const getRecords = async () => {
      const response = await axios.get(`${url}/repayments`);
      if (response) {
        setRepayments(response.data.data);
      } else {
        setRepayments(response.message);
      }
    };
    const getSeasons = async () => {
      const response = await axios.get(`${url}/seasons`);
      if (response) {
        setSeasons(response.data.data);
      } else {
        setResponse([response.message]);
      }
    };
    const getCustomers = async () => {
      const response = await axios.get(`${url}/customers`);
      if (response) {
        setCustomers(response.data.data);
      } else {
        setResponse(responses.push(response.message));
      }
    };
    getSummaries();
    getRecords();
    getSeasons();
    getCustomers();
  }, []);
  const change = (e) => {
    setFile({
      selectedFile: e.target.files[0],
    });
    setDisabled(false);
  };
  const sendInput = async (e, endpoint) => {
    e.preventDefault();
    const data = new FormData();
    data.append("repayments", fills.selectedFile);
    const response = await axios.post(
      `http://localhost:3500/api/${endpoint}`,
      data
    );
    if (response) {
      setDisabled(true);
      const repayments = await axios.get(
        `http://localhost:3500/api/repayments`
      );
      const summaries = await axios.get(
        `http://localhost:3500/api/customers/summary`
      )
    
      setRepayments(repayments.data.data);
      setCustomerState(summaries.data.data)
    }
  };
  const onFilterSummary = async (e) => {
    e.preventDefault();
    const customer =
      filter.customer &&
      customers.filter(
        (customer) =>
          customer.CustomerName.toLowerCase() === filter.customer.toLowerCase()
      );
    const season =
      filter.season &&
      seasons.filter(
        (season) =>
          season.SeasonName.toLowerCase() === filter.season.toLowerCase()
      );
    const CustomerID =
      customer && customer.length ? customer[0].CustomerID : "";
    const SeasonID = season && season.length ? season[0].SeasonID : "";
    const response = await axios.get(
      `http://localhost:3500/api/customers/summary?CustomerID=${CustomerID}&&SeasonID=${SeasonID}`
    );
    if (response) {
      setCustomerState(response.data.data);
    } else {
    }
  };
  const onFilterRepayments = async (e) => {
    e.preventDefault();
    const customer =
      filter.customer &&
      customers.filter(
        (customer) =>
          customer.CustomerName.toLowerCase() === filter.customer.toLowerCase()
      );
    const repayment =
      filter.repaymentID &&
      repayments.filter(
        (repayment) => repayment.RepaymentsID === Number(filter.repaymentID)
      );
    const CustomerID =
      customer && customer.length ? customer[0].CustomerID : "";
    const RepaymentID =
      repayment && repayment.length ? repayment[0].RepaymentsID : "";

    const response = await axios.get(
      `http://localhost:3500/api/repayments?CustomerID=${CustomerID}&&RepaymentsID=${RepaymentID}`
    );
    if (response) {
      setRepayments(response.data.data);
    } else {
    }
  };
  const resetDb = async (e) => {
    e.preventDefault();
    const response = await axios.get("http://localhost:3500/resetDb");
    if (response) {
      setTimeout(() => {
        setResetInfo(response.data.message);
      }, 1);
      setTimeout(() => {
        setResetInfo("");
      }, 1000);
    }
  };
  const filterValue = (e) => {
    setFilters({ [e.target.name]: e.target.value });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Flex
        direction={"row"}
        width="100%"
        height="100%"
        justifyContent="space-between"
      >
        <Flex
          direction={"column"}
          width={["90%", "47%"]}
          px={"5%"}
          bg="blue.100"
          justifyContent="center"
        >
          <Text fontSize={"4xl"} lineHeight="3xl">
            {" "}
            Seasonless Payments
          </Text>
          <Text py="2rem">
            {" "}
            Instructions: To use the seasonless payment platform, upload your
            Excel or JSON file and select one of the operations below.
          </Text>
          <input type="file" name="Repayments" onChange={change} />
          <Flex>
            <Flex
              direction={["column", "column", "row"]}
              width={["80%", "80%", "50%"]}
              flexWrap="wrap"
            >
              <Button
                type="button"
                mt={4}
                variantColor="button"
                mx={["10%", "5%"]}
                w={["80%", "80%"]}
                onClick={(e) => sendInput(e, "mrepayments")}
                isDisabled={disabled}
              >
                Add Repayments
              </Button>
            </Flex>
            <Flex
              bg="gray.100"
              w={"250px"}
              h={"150px"}
              transform="translateX(60%)"
            >
              <Text w={"100%"} p="5%">
                Server Response
              </Text>
              {responses &&
                responses.map((response) => {
                  return <div>{response}</div>;
                })}
            </Flex>
          </Flex>
        </Flex>

        <Flex direction="column" width={["80%", "80%", "47%"]}>
          <Box my="2%" mr="3%" border="1px" borderColor="gray.200">
            <Text fontSize="3xl" textAlign="center">
              {" "}
              Customer Summaries
            </Text>
            <form onSubmit={onFilterSummary}>
              <Flex justifyContent="space-between" m="2%">
                <Text>Filter By</Text>
                <input
                  type="text"
                  name="customer"
                  placeholder="Customer name"
                  onChange={(e) => filterValue(e)}
                />
                <input
                  type="text"
                  name="season"
                  placeholder="Season name"
                  onChange={(e) => filterValue(e)}
                />
                <input type="submit" value="Filter" />
              </Flex>
            </form>
            <Box height="280px" overflow="auto" border my="1%">
              {customerState &&
                customerState.map((singleSummary) => {
                  return (
                    <Flex justifyContent="space-between" m="2%" key={`${singleSummary.CustomerID}-${singleSummary.SeasonID}`}>
                      <Box fontSize="14px">
                        CustomerName: {singleSummary.CustomerName}
                      </Box>
                      <Box fontSize="14px">
                        SeasonName: {singleSummary.SeasonName}
                      </Box>
                      <Box fontSize="14px">
                        TotalRepaid: {singleSummary.TotalRepaid}
                      </Box>
                      <Box fontSize="14px">
                        TotalCredit: {singleSummary.TotalCredit}
                      </Box>
                    </Flex>
                  );
                })}
            </Box>
          </Box>
          <Box my="2%" mr="3%" border="1px" borderColor="gray.200">
            <Text fontSize="3xl" textAlign="center">
              Repayment Records
            </Text>
            <form onSubmit={onFilterRepayments}>
              <Flex justifyContent="space-between" m="2%">
                <Text>Filter By</Text>
                <input
                  type="text"
                  name="customer"
                  placeholder="Customer name"
                  onChange={(e) => filterValue(e)}
                />
                <input
                  type="text"
                  name="repaymentID"
                  placeholder="Repayment ID"
                  onChange={(e) => filterValue(e)}
                />
                <input type="submit" value="Filter" />
              </Flex>
            </form>
            <Box height="280px" overflow="auto">
              {repayments &&
                repayments.map((singleSummary) => {
                  return (
                    <Flex justifyContent="space-between" m="2%" key={singleSummary.RepaymentsID}>
                      <Box fontSize="12px">
                        RepaymentID: {singleSummary.RepaymentsID}{" "}
                      </Box>
                      <Box fontSize="12px">
                        CustomerName: {singleSummary.CustomerName}{" "}
                      </Box>
                      <Box fontSize="12px">
                        SeasonName: {singleSummary.SeasonName}{" "}
                      </Box>
                      <Box fontSize="12px">Date: {singleSummary.Date}</Box>
                      <Box fontSize="12px">Amount: {singleSummary.Amount}</Box>
                      <Box fontSize="12px">
                        ParentID:{singleSummary.ParentID}
                      </Box>
                    </Flex>
                  );
                })}
            </Box>
          </Box>
        </Flex>
      </Flex>
      <Flex>
        <Button
          type="button"
          mt={4}
          variantColor="red"
          mx={["10%", "5%"]}
          w={["80%", "40%"]}
          onClick={resetDb}
        >
          Reset Database
        </Button>
        {resetInfo && <div>{resetInfo} </div>}
      </Flex>
    </ThemeProvider>
  );
}

export default App;
