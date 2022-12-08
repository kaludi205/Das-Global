using System.Collections.Generic;

namespace DasGlobal.Models.UploadFile
{
    public class EmpresaFile
    {
        public string             nombre     { get; set; }
        public string             pais       { get; set; }
        public List<SucursalFile> sucursales { get; set; }
    }
}