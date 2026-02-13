// CMS Hospital General Information API
const CMS_API_BASE =
  "https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u/0";

export async function searchHospitalsByCMS(
  city = null,
  state = null,
  limit = 100,
) {
  try {
    const conditions = [];

    if (city) {
      conditions.push({
        property: "citytown",
        value: city.toUpperCase(),
        operator: "=",
      });
    }

    if (state) {
      conditions.push({
        property: "state",
        value: state.toUpperCase(),
        operator: "=",
      });
    }

    const requestBody = {
      limit: limit,
      offset: 0,
    };

    // Add conditions if they exist
    if (conditions.length > 0) {
      requestBody.conditions = conditions;
    }

    const response = await fetch(CMS_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CMS API Response:", errorText);
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform CMS data to match our hospital schema
    return data.results.map((hospital) => ({
      cms_id: hospital.facility_id,
      name: hospital.facility_name,
      street: hospital.address,
      city: hospital.citytown,
      state: hospital.state,
      zip_code: hospital.zip_code,
      phone: hospital.telephone_number,
      hospital_type: hospital.hospital_type,
      ownership: hospital.hospital_ownership,
      rating: hospital.hospital_overall_rating,
    }));
  } catch (error) {
    console.error("Error fetching from CMS API:", error);
    throw error;
  }
}

export async function searchHospitalByName(name, limit = 10) {
  try {
    // Fetch a large set and filter client-side since LIKE may not work
    const requestBody = {
      limit: 1000,
      offset: 0,
    };

    console.log("Searching hospitals by name:", name);

    const response = await fetch(CMS_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CMS API Response:", errorText);
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter results client-side by name (case-insensitive partial match)
    const nameUpper = name.toUpperCase();
    const filteredResults = data.results.filter(
      (hospital) =>
        hospital.facility_name &&
        hospital.facility_name.toUpperCase().includes(nameUpper),
    );

    console.log(
      `Filtered ${data.results.length} hospitals to ${filteredResults.length} matching "${name}"`,
    );

    // Return limited results
    return filteredResults.slice(0, limit).map((hospital) => ({
      cms_id: hospital.facility_id,
      name: hospital.facility_name,
      street: hospital.address,
      city: hospital.citytown,
      state: hospital.state,
      zip_code: hospital.zip_code,
      phone: hospital.telephone_number,
      hospital_type: hospital.hospital_type,
      ownership: hospital.hospital_ownership,
      rating: hospital.hospital_overall_rating,
    }));
  } catch (error) {
    console.error("Error fetching from CMS API:", error);
    throw error;
  }
}

export async function searchHospitalsByZipcode(
  zipcode,
  state = null,
  limit = 100,
) {
  try {
    // First try exact match
    let requestBody = {
      limit: limit,
      offset: 0,
      conditions: [
        {
          property: "zip_code",
          value: zipcode,
          operator: "=",
        },
      ],
    };

    console.log("Searching hospitals by exact zipcode:", zipcode);

    let response = await fetch(CMS_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CMS API Response:", errorText);
      throw new Error(`CMS API error: ${response.status}`);
    }

    let data = await response.json();
    console.log("Exact zipcode match:", data.results?.length || 0, "hospitals");

    // If no exact match, search by state and filter by zip prefix
    if (data.results.length === 0 && zipcode.length >= 3 && state) {
      const zipPrefix = zipcode.substring(0, 3);
      console.log(
        `No exact match, searching state ${state} and filtering by zip prefix ${zipPrefix}`,
      );

      // Fetch hospitals in the state
      requestBody = {
        limit: 500,
        offset: 0,
        conditions: [
          {
            property: "state",
            value: state.toUpperCase(),
            operator: "=",
          },
        ],
      };

      response = await fetch(CMS_API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("CMS API Response:", errorText);
        throw new Error(`CMS API error: ${response.status}`);
      }

      data = await response.json();

      // Filter results client-side by zip prefix
      const filteredResults = data.results.filter(
        (hospital) =>
          hospital.zip_code && hospital.zip_code.startsWith(zipPrefix),
      );

      console.log(
        `Filtered ${data.results.length} hospitals to ${filteredResults.length} with zip prefix ${zipPrefix}`,
      );

      // Limit to requested amount
      data.results = filteredResults.slice(0, limit);
    }

    return data.results.map((hospital) => ({
      cms_id: hospital.facility_id,
      name: hospital.facility_name,
      street: hospital.address,
      city: hospital.citytown,
      state: hospital.state,
      zip_code: hospital.zip_code,
      phone: hospital.telephone_number,
      hospital_type: hospital.hospital_type,
      ownership: hospital.hospital_ownership,
      rating: hospital.hospital_overall_rating,
    }));
  } catch (error) {
    console.error("Error fetching from CMS API:", error);
    throw error;
  }
}

export async function searchHospitalByFacilityId(facilityId) {
  try {
    const requestBody = {
      limit: 1,
      offset: 0,
      conditions: [
        {
          property: "facility_id",
          value: facilityId,
          operator: "=",
        },
      ],
    };

    const response = await fetch(CMS_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CMS API Response:", errorText);
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.results.length === 0) {
      return null;
    }

    const hospital = data.results[0];
    return {
      cms_id: hospital.facility_id,
      name: hospital.facility_name,
      street: hospital.address,
      city: hospital.citytown,
      state: hospital.state,
      zip_code: hospital.zip_code,
      phone: hospital.telephone_number,
      hospital_type: hospital.hospital_type,
      ownership: hospital.hospital_ownership,
      rating: hospital.hospital_overall_rating,
    };
  } catch (error) {
    console.error("Error fetching hospital by facility ID:", error);
    throw error;
  }
}
