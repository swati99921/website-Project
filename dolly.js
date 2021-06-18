
const xhr = new XMLHttpRequest();
const get_states_url = 'https://cdn-api.co-vin.in/api/v2/admin/location/states'

xhr.open('GET', get_states_url)

xhr.onreadystatechange = () => {
    if (xhr.status == 200 && xhr.readyState == 4) {
        var states_res = JSON.parse(xhr.responseText);
        console.log(states_res);

        // console.log(states_res.states.length);
        const states_length = states_res.states.length

        const state_select = document.getElementById('state-select');
        var output = ''
        for (let i = 0; i < states_length; i++) {
            output += `<option>${states_res.states[i].state_name}</option>`

        }
        state_select.innerHTML = output

        // changing the states
        var selected_index, state_id
        state_select.addEventListener('change', (e) => {
            // console.log(e);
            selected_index = e.target.selectedIndex
            if (selected_index < 8) {
                state_id = (selected_index + 1)
            }
            else if (selected_index == 8) {
                state_id = 37
            }
            else {
                state_id = selected_index
            }
            // console.log(state_id);

            // Districts      

            const district_url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`
            // console.log(district_url);

            xhr.open('GET', district_url)

            xhr.onreadystatechange = () => {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    const district_res = JSON.parse(xhr.responseText)
                    console.log(district_res);

                    const district_length = district_res.districts.length
                    var output = ''
                    const district_select = document.getElementById('district-select')
                    for (let i = 0; i < district_length; i++) {
                        output += `<option>${district_res.districts[i].district_name}</option>`
                    }

                    district_select.innerHTML = output

                    district_select.addEventListener('change', (e) => {
                        district_name = e.target.value
                        console.log(district_name);

                        var district_id = -1
                        for (let i = 0; i < district_length; i++) {
                            if (district_res.districts[i].district_name == district_name) {
                                district_id = district_res.districts[i].district_id
                                break
                            }
                        }
                        console.log(district_id);

                        const vaccination_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=15-06-2021`

                        console.log(vaccination_url);

                        xhr.open('GET', vaccination_url)

                        xhr.onreadystatechange = () => {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                const vaccination_data = JSON.parse(xhr.responseText)
                                console.log(vaccination_data);
                                // data dom manipulation
                                const vaccination_len = vaccination_data.sessions.length;
                                var output = '';
                                var output1 = '';
                                // var output2 = '';
                                for (let i = 0; i < vaccination_len; i++) {
                                    output += `<tr>${vaccination_data.sessions[i].name}
                                            <br> ${vaccination_data.sessions[i].address}<hr></tr>`

                                    output1 += `<tr>Available Dose 1: ${vaccination_data.sessions[i].available_capacity_dose1}
                                            <br> Available Dose 2 : ${vaccination_data.sessions[i].available_capacity_dose2}<br>${vaccination_data.sessions[i].fee_type}<hr></tr>`

                                    // output2+= `<tr>${vaccination_data.sessions[i].fee_type}</tr>`
                                }
                                place.innerHTML = output
                                availableslots.innerHTML = output1
                                // free-paid.innerHTML=output2
                            }
                        }
                        xhr.send()
                    })
                }
            }

            xhr.send()

        })
    }
}
xhr.send()


