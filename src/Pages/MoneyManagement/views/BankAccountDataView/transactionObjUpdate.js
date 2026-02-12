import uuid from "react-uuid";
import _ from "lodash"

export const modifyCreditDebit = (data) => {
    const addProperties = (transactions, isUnmapped) => {
        transactions.forEach(transaction => {
            Object.assign(transaction, {
                id: uuid(),
                isChecked: false,
                selectedCat: transaction.category ?? ''
            });

            if (isUnmapped) {
                addSubCatPropertiesUnmapped(transaction.transaction_list);
            } else {
                addSubCatProperties(transaction.transaction_list);
            }


        });
    };

    const addSubCatProperties = (transactions) => {
        transactions.forEach(transaction => {
            Object.assign(transaction, {
                isChecked: false,
                selectedCat: transaction.category ?? '',
                initialCat: transaction.category ?? ''
            });
        });
    };

    const addSubCatPropertiesUnmapped = (transactions) => {
        transactions.forEach(transaction => {
            Object.assign(transaction, {
                isChecked: false,
                selectedCat: '',
                category: '',
                initialCat: ''
            });
        });
    };

    // Loop through each account in mapped_data
    for (const account in data.mapped_data) {
        if (data.mapped_data.hasOwnProperty(account)) {
            const accountData = data.mapped_data[account];

            if (accountData.CREDIT) {
                addProperties(accountData.CREDIT, false);
            }

            if (accountData.DEBIT) {
                addProperties(accountData.DEBIT, false);
            }
        }
    }

    // Loop through each account in unmapped_data
    for (const account in data.unmapped_data) {
        if (data.unmapped_data.hasOwnProperty(account)) {
            const accountData = data.unmapped_data[account];

            if (accountData.CREDIT) {
                addProperties(accountData.CREDIT, true);
            }

            if (accountData.DEBIT) {
                addProperties(accountData.DEBIT, true);
            }
        }
    }
    return data;
}

export const updateCreditDebit = (data, id, checked, selectedCat, isCheckboxUpdate, isSelectUpdate) => {

    let dataDeepCopy = _.cloneDeep(data);

    const addSubCatProperties = (transactions, checked, selectedCat) => {

        if (transactions.every(data => !data.isChecked) || isCheckboxUpdate) {
            return transactions.map(transaction => ({
                ...transaction,
                isChecked: isSelectUpdate ? true : checked,
                // selectedCat: (isCheckboxUpdate || checked) && selectedCat != '' ? selectedCat : transaction.selectedCat,
                // category: (isCheckboxUpdate || checked) && selectedCat != '' ? selectedCat : transaction.selectedCat,
                selectedCat: selectedCat,
                category: selectedCat
            }))
        } else {
            return transactions.map(transaction => ({
                ...transaction,
                isChecked: transaction.isChecked,
                selectedCat: transaction.isChecked ? selectedCat : transaction.selectedCat,
                category: transaction.isChecked ? selectedCat : transaction.selectedCat
            }))
        }
    };



    const updateProperties = (transactions) => {
        return transactions.map(transaction => {
            if (transaction.id == id) {
                return {
                    ...transaction,
                    isChecked: (isSelectUpdate && (transaction.transaction_list.every(data => !data.isChecked) || transaction.transaction_list.every(data => data.isChecked))) ? true : checked,
                    selectedCat: selectedCat,
                    transaction_list: addSubCatProperties(transaction.transaction_list, checked, selectedCat)
                }
            } else {
                return transaction
            }
        });
    };

    if (dataDeepCopy.mapped.CREDIT) {
        dataDeepCopy.mapped.CREDIT = updateProperties(dataDeepCopy.mapped.CREDIT);
    }

    if (dataDeepCopy.mapped.DEBIT) {
        dataDeepCopy.mapped.DEBIT = updateProperties(dataDeepCopy.mapped.DEBIT);
    }

    if (dataDeepCopy.unmapped.CREDIT) {
        dataDeepCopy.unmapped.CREDIT = updateProperties(dataDeepCopy.unmapped.CREDIT);
    }

    if (dataDeepCopy.unmapped.DEBIT) {
        dataDeepCopy.unmapped.DEBIT = updateProperties(dataDeepCopy.unmapped.DEBIT);
    }

    return dataDeepCopy;
}

export const updateSubTransaction = (data, mainCatId, id, checked, selectedCat) => {

    let dataDeepCopy = _.cloneDeep(data);

    const addSubCatProperties = (transactions) => {
        return transactions.map(transaction => {
            if (transaction.txnId == id) {
                return {
                    ...transaction,
                    isChecked: checked,
                    selectedCat: selectedCat,
                    category: selectedCat,
                }
            } else {
                return transaction
            }
        })
    };

    const updateProperties = (transactions) => {
        return transactions.map(transaction => {
            if (transaction.id == mainCatId) {
                return {
                    ...transaction,
                    isChecked: !checked ? false : transaction.checked,
                    transaction_list: addSubCatProperties(transaction.transaction_list)
                }
            } else {
                return transaction
            }
        });
    };

    if (dataDeepCopy.mapped.CREDIT) {
        dataDeepCopy.mapped.CREDIT = updateProperties(dataDeepCopy.mapped.CREDIT);
    }

    if (dataDeepCopy.mapped.DEBIT) {
        dataDeepCopy.mapped.DEBIT = updateProperties(dataDeepCopy.mapped.DEBIT);
    }

    if (dataDeepCopy.unmapped.CREDIT) {
        dataDeepCopy.unmapped.CREDIT = updateProperties(dataDeepCopy.unmapped.CREDIT);
    }

    if (dataDeepCopy.unmapped.DEBIT) {
        dataDeepCopy.unmapped.DEBIT = updateProperties(dataDeepCopy.unmapped.DEBIT);
    }

    return dataDeepCopy;
}

const getcheckedTransactions = (transactions) => {
    let checkedTransactions = []
    transactions.forEach(transaction => {
        // checkedTransactions = [...checkedTransactions, ...transaction.transaction_list.filter(data => data.isChecked == true)]
        checkedTransactions = [...checkedTransactions, ...transaction.transaction_list.filter(data => data.initialCat != data.selectedCat)]
    });
    return checkedTransactions;
}

export const getInflowCheckedTransactions = (data) => {

    let mappedCheckedTransactions = []

    let dataDeepCopy = _.cloneDeep(data);

    if (dataDeepCopy.mapped.CREDIT) {
        mappedCheckedTransactions = [...mappedCheckedTransactions, ...getcheckedTransactions(dataDeepCopy.mapped.CREDIT)];
    }

    if (dataDeepCopy.unmapped.CREDIT) {
        mappedCheckedTransactions = [...mappedCheckedTransactions, ...getcheckedTransactions(dataDeepCopy.unmapped.CREDIT)];
    }

    return mappedCheckedTransactions;

}


export const getOutflowCheckedTransactions = (data) => {

    let mappedCheckedTransactions = []

    let dataDeepCopy = _.cloneDeep(data);

    if (dataDeepCopy.mapped.DEBIT) {
        mappedCheckedTransactions = [...mappedCheckedTransactions, ...getcheckedTransactions(dataDeepCopy.mapped.DEBIT)];
    }

    if (dataDeepCopy.unmapped.DEBIT) {
        mappedCheckedTransactions = [...mappedCheckedTransactions, ...getcheckedTransactions(dataDeepCopy.unmapped.DEBIT)];
    }

    return mappedCheckedTransactions;

}
