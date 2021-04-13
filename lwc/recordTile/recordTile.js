import { LightningElement ,api} from 'lwc';

export default class RecordTile extends LightningElement {
    @api record;
    changeStyle = false;
    get buttonColor(){
        return this.changeStyle ? 'bgcolor': 'btcolor';
    }
    handleChange(){
        this.changeStyle = !this.changeStyle;
            const addToFav = new CustomEvent(
                'addfav',
                {
                    detail : {
                       recordId : this.record.Id,
                       recordName : this.record.Name,
                    }
                }
            );
            this.dispatchEvent(addToFav);
    }
}