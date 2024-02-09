import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import axios from "axios";
import Swal from 'sweetalert2';
import VotingXa1 from "../components/VoteXa1"

export const Voting_xa = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const tableRef = useRef(null);
    const [totalItems, setTotalItems] = useState(0);

    const [selectedValues, setSelectedValues] = useState({
   
    });

    const handleRadioChange = (columnIndex, value) => {
        // Get the current selected values for the column
        const currentSelectedValues = [...selectedValues];

        // Check if the value is already selected for the current column
        const valueIndex = currentSelectedValues.indexOf(value);

        // If not selected, add the value to the column
        // If selected, remove the value from the column
        if (valueIndex === -1) {
            if (value !== 0) {
                currentSelectedValues[columnIndex] = value;
            }
            else {
                currentSelectedValues[columnIndex] = 0;
            }
        } else {
            currentSelectedValues[columnIndex] = 0;
        }
        // Filter out null values and keep only the first three selections for each column
        const filteredSelectedValues = currentSelectedValues
            .filter((val, index) => val !== null && index <= 2);

        // Update the state with the new selected values
        setSelectedValues(currentSelectedValues);

    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        axios
            .get('http://localhost:4001/teams/all-votes-teams', {
                params: {
                    category: "FÍSICA Y QUÍMICA"
                }
            })
            .then(response => {
                setTeams(response.data);
                setSelectedValues(Array.from({ length: response.data.length }, () => 0));
                setLoading(false)
                setTotalItems(response.data.length);
            })
            .catch(error => console.error(`There was an error retrieving the team list: ${error}`));
    }




    const fetchTeams2 = async () => {
        axios
            .get("http://localhost:4001/teams/all-votes-table", {
                params: {
                    table: "votes_físicayquímica"
                }
            })
            .then((response) => {
                setTeams(response.data);
                setLoading(false);
            })
            .catch((error) =>
                console.error(`There was an error retrieving the team list: ${error}`));
    };




    const handleSubmit = async (event) => {

        const postData = [];

        event.preventDefault();

        if (formSubmitted) {
            return;
        }

        for (let i = 0; i <= 16; i++) {
            const points = selectedValues[i] !== null ? selectedValues[i] : 0;
            const teamName = teams[i]?.name;

            postData.push({
                points,
                team: teamName,
            });
        }


        try {
            // Perform the POST request with the selected value
            const response = await axios.post(
                "http://localhost:4001/teams/add-points-fyq",
                {
                    postData,
                }
            );
            console.log(postData);
            fetchTeams2();

            Swal.fire({
                icon: 'success',
                title: 'Puntos Actualizados',
                text: 'Puntos Actualizados Exitosamente!',
            });
            setFormSubmitted(true);
            // Handle the response as needed
            console.log("Points updated successfully");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error durante el proceso. Por favor, intete de nuevo.',
            });
            console.log("Error during POST request:", error);
        }
        fetchTeams();

    };

    const renderTableRow = (team, index) => (
        <tr key={team.id}>
          <td>{team.name}</td>
          <td>{team.category}</td>
          <td>{team.description}</td>
          <td>
            <input
              type="checkbox"
              value="10"
              name={`checkbox-${team.id}`}
              checked={selectedValues[index] === "10"}
              onChange={() => handleRadioChange(index, "10")}
            />
          </td>
          <td>
            <input
              type="checkbox"
              value="5"
              name={`checkbox-${team.id}`}
              checked={selectedValues[index] === "5"}
              onChange={() => handleRadioChange(index, "5")}
            />
          </td>
          <td>
            <input
              type="checkbox"
              value="3"
              name={`checkbox-${team.id}`}
              checked={selectedValues[index] === "3"}
              onChange={() => handleRadioChange(index, "3")}
            />
          </td>
        </tr>
    );    
    

    return (

        <Container>
            <div>
                <h2 class="text-center m-auto mb-3">TABLA DE FÍSICA Y QUÍMICA</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <table class="table table-striped table-bordered">
                                {/* Table headers */}
                                <thead class="table-dark">
                                        <tr>
                                        <th>Nombre del Equipo</th>
                                        <th>Categoria</th>
                                        <th>Descripcion</th>
                                        <th>10 puntos</th>
                                        <th>5 puntos</th>
                                        <th>3 puntos</th>
                                        </tr>
                                </thead>
                                {/* Table body */}
                                <tbody>
                                    {teams.map((team, index) => renderTableRow(team, index))}
                                </tbody>
                        </table>
                    
                        {!formSubmitted && (
                            <button
                                className="mt-3 mb-3"
                                type="submit"
                                style={{
                                    fontSize: '20px',
                                    padding: '10px 20px',
                                    width: '200px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Submit
                            </button>
                        )}
                    </form>

                )}
            </div>
            <VotingXa1></VotingXa1>
        </Container>
        



    );
};
export default Voting_xa;



