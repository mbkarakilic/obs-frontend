const tcknRegex = /^[1-9][0-9]{10}$/;
const firstnameRegex = /^[a-zA-ZÇĞİÖŞÜçğıöşü\s]{2,50}$/;
const lastnameRegex = /^[A-ZÇĞİÖŞÜa-zçğıöşü]{1,50}$/;

const validateNationalId = (nationalId) => {
  return tcknRegex.test(nationalId);
};

const validateFirstname = (firstname) => {
  return firstnameRegex.test(firstname);
};

const validateLastname = (lastname) => {
  return lastnameRegex.test(lastname);
};

export const validateAll = (nationalId, firstname, lastname) => {
  if (!validateNationalId(nationalId)) {
    console.log(nationalId);
    return false;
  }
  if (!validateFirstname(firstname)) {
    console.log(firstname);
    return false;
  }
  if (!validateLastname(lastname)) {
    console.log(lastname);
    return false;
  }
  return true;
};
