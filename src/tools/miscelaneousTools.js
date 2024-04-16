export const convertDate = (date) => {
    const newDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return newDate.toLocaleDateString('fr-FR', options);
}

export const changeArray = (arr, entity) => {
    const newArr = [];
    arr.forEach((item) => {
      newArr.push(`/api/${entity}/${item}`);
    })
    return newArr
  }