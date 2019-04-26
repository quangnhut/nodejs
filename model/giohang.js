function GioHang(oldCart) {
    this.items = oldCart.items || {};
    this.add = function (id, item) {
        var gioHang = this.items[id];
        if (!gioHang) {
            gioHang = this.items[id] = { item: item, soLuong: 0, tien: 0 }
        }
        gioHang.soLuong++;
        gioHang.tien = gioHang.soLuong * gioHang.item.price;
    }
    this.convertArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
    this.updateCart = function(id, sl){
        var gioHangNew = this.items[id];
        gioHangNew.soLuong = sl;
        gioHangNew.tien = (gioHangNew.item.price * sl);
    }
    this.deleteCart = function(id){
        delete this.items[id];
    }
}
module.exports = GioHang;