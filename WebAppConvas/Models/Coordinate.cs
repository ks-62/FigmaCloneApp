namespace WebAppConvas.Models
{
    public class Coordinate
    {

        public string Name { get; set; }

        public string Figure { get; set; }

        public string Orientation { get; set; }

        public int StartX { get; set; }

        public int StartY { get; set; }

        public int EndX { get; set; }

        public int EndY { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        //===Border===
        public int BorderStartX { get; set; }

        public int BorderStartY { get; set; }

        public int BorderEndX { get; set; }

        public int BorderEndY { get; set; }

        public int BorderWidth { get; set; }

        public int BorderHeight { get; set; }
        //===---------

        public int LeftTopX { get; set; }

        public int LeftTopY { get; set; }

        public int RightTopX { get; set; }

        public int RightTopY { get; set; }

        public int LeftBottomX { get; set; }

        public int LeftBottomY { get; set; }

        public int RightBottomX { get; set; }

        public int RightBottomY { get; set; }

        public string FillColor { get; set; }

        public int LineWidth { get; set; }

        public string BorderColor { get; set; }

    }
}
