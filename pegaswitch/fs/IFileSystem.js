var utils = require('../utils');
var Result = require('../Result');

function IFileSystem (sc, handle) {
	this.sc = sc;
	this.handle = handle;
}

IFileSystem.prototype.OpenDir = function (dir) {
	var path = utils.str2ab(dir);
	var self = this;
	return this.sc.ipcMsg(9).datau64(3).xDescriptor(path, path.byteLength, 0).sendTo(this.handle).asResult()
		.map((r) => new self.sc.IDirectory(self.sc, dir, r.movedHandles[0], self));
};

IFileSystem.prototype.CreateFile = function (path, size) {
	if (size === undefined) {
		size = 0x100;
	}
	var pbuf = utils.str2ab(path);
	var res = this.sc.ipcMsg(0).datau64(0, size).xDescriptor(pbuf, pbuf.byteLength, 0).sendTo(this.handle);
	return res.asResult();
};

IFileSystem.prototype.OpenFile = function (path) {
	var pbuf = utils.str2ab(path);
	var self = this;
	return this.sc.ipcMsg(8).datau32(3).xDescriptor(pbuf, pbuf.byteLength, 0).sendTo(this.handle)
		.asResult()
		.map((r) => new self.sc.IFile(self.sc, r.movedHandles[0]));
};

IFileSystem.prototype.WriteBufferToFile = function (offset, buffer, size) {
	return this.sc.ipcMsg(1).aDescriptor(buffer, size, 1).data(0, offset, size).sendTo(this.handle).asResult();
};

IFileSystem.prototype.Close = function () {
	return this.sc.svcCloseHandle(this.handle);
};

module.exports = IFileSystem;
