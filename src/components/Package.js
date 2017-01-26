import React, {PropTypes} from "react";
import {Glyphicon} from "react-bootstrap";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

const Package = ({entityTypes, packages, handleSelectPackage, handleSelectEntityType}) => {
    const addType = type => item => ({
        type,
        ...item
    })
    const glyphs = {'entity': 'list', 'package': 'folder-open'}
    const onRowClick = (row) => {
        switch (row.type) {
            case 'entity':
                handleSelectEntityType(row.fullName)
                break
            case 'package':
                handleSelectPackage(row.fullName)
                break
            default:
        }
    }
    const nameFormatter = (cell, row) => {
        return <span onClick={() => onRowClick(row)}><Glyphicon
            glyph={glyphs[row.type]}/>&nbsp;&nbsp;{row.label}</span>
    }
    const data = [...packages.map(addType('package')), ...entityTypes.map(addType('entity'))];
    return <BootstrapTable data={data} options={onRowClick}>
        <TableHeaderColumn dataField='fullName' isKey={true} dataFormat={nameFormatter}>Name</TableHeaderColumn>
        <TableHeaderColumn dataField="description" columnClassName="hidden-xs">Description</TableHeaderColumn>
    </BootstrapTable>
}

Package.propTypes = {
    entityTypes: PropTypes.array.isRequired,
    packages: PropTypes.array.isRequired,
    handleSelectEntityType: PropTypes.func,
    handleSelectPackage: PropTypes.func
}

export default Package
