using System.Collections.Generic;

namespace DasGlobal.Models.UploadFile
{
    public class SucursalFile
    {
        public string                  nombre        { get; set; }
        public string                  direccion     { get; set; }
        public string                  telefono      { get; set; }
        public List<ColaboradorUpload> colaboradores { get; set; }
    }
}