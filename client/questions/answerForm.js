import React, {Component} from 'react';
import {
    Create,
    Edit,
    List,
    SimpleForm,
    DisabledInput,
    TextInput,
    DateInput,
    NumberInput,
    LongTextInput,
    ReferenceField,
    ReferenceManyField,
    ReferenceInput,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    SelectInput,
    ImageInput,
    ImageField,
    FormTab,
    TabbedForm,
    NullableBooleanInput,
} from 'admin-on-rest';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import EmbeddedManyInput from './AddNewAnswerButton'
import {required, minValue, maxValue} from 'admin-on-rest';

const styles = {
    customWidth: {
        width: 150,
    },
};

/**
 * `SelectField` is implemented as a controlled component,
 * with the current selection set through the `value` property.
 * The `SelectField` can be disabled with the `disabled` property.
 */
export default class SelectTypeAnswer extends Component {
    state = {
        value: 1,
    };

    handleChange = (event, index, value) => this.setState({value});
    // componentWillUpdate(nextState, nextProps) {
    //     console.log(nextState)
    // }

    render() {

        return (
            <div>
                <SelectField
                    floatingLabelText="Type"
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                >
                    <MenuItem value={1} primaryText="Text"/>
                    <MenuItem value={2} primaryText="Image"/>
                </SelectField>
                <EmbeddedManyInput isRefresh={this.state.value} source="answers">
                    {this.state.value == 1 && <TextInput source="content" label="Answer"/>}
                    {this.state.value == 1 && <NullableBooleanInput source="isCorrect" label="Is Correct?" validate={[required]}/>}
                    {this.state.value == 2 && <ImageInput source="photos" label="Answer's Image" accept="image/*" value={2} validate={[required]}>
                        <ImageField source="src" title="title"/>
                    </ImageInput>}
                </EmbeddedManyInput>
            </div>
        );
    }
}
